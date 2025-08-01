"""
Document management routes
"""

import os
import hashlib
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from core.database import get_db, User, Document, Verification
from core.security import get_current_active_user
from core.config import settings
from services.blockchain_service import BlockchainService
from services.ipfs_service import IPFSService
from services.file_service import FileService

router = APIRouter()
blockchain_service = BlockchainService()
ipfs_service = IPFSService()
file_service = FileService()


class DocumentCreate(BaseModel):
    """Document creation model"""
    title: str
    description: Optional[str] = None


class DocumentResponse(BaseModel):
    """Document response model"""
    id: int
    title: str
    description: Optional[str]
    file_size: int
    file_type: str
    file_hash: str
    ipfs_hash: Optional[str]
    blockchain_tx_hash: Optional[str]
    is_verified: bool
    created_at: str
    updated_at: Optional[str]

    class Config:
        from_attributes = True


class DocumentUploadResponse(BaseModel):
    """Document upload response model"""
    document: DocumentResponse
    ipfs_hash: Optional[str]
    blockchain_tx_hash: Optional[str]
    verification_status: str


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload a new document"""
    # Validate file
    if not file_service.is_valid_file(file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type or size"
        )
    
    # Save file locally
    file_path = await file_service.save_file(file, current_user.id)
    
    # Calculate file hash
    file_hash = file_service.calculate_file_hash(file_path)
    
    # Create document record
    document = Document(
        title=title,
        description=description,
        file_path=file_path,
        file_size=file.size,
        file_type=file.content_type,
        file_hash=file_hash,
        owner_id=current_user.id
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Upload to IPFS
    ipfs_hash = None
    try:
        ipfs_hash = await ipfs_service.upload_file(file_path)
        document.ipfs_hash = ipfs_hash
    except Exception as e:
        print(f"IPFS upload failed: {e}")
    
    # Store on blockchain
    blockchain_tx_hash = None
    try:
        blockchain_tx_hash = await blockchain_service.store_document_hash(
            file_hash, ipfs_hash, current_user.id
        )
        document.blockchain_tx_hash = blockchain_tx_hash
        document.is_verified = True
    except Exception as e:
        print(f"Blockchain storage failed: {e}")
    
    # Create verification record
    verification = Verification(
        document_id=document.id,
        user_id=current_user.id,
        verification_type="upload",
        status="success" if blockchain_tx_hash else "failed",
        blockchain_tx_hash=blockchain_tx_hash,
        ipfs_hash=ipfs_hash
    )
    
    db.add(verification)
    db.commit()
    db.refresh(document)
    
    return DocumentUploadResponse(
        document=document,
        ipfs_hash=ipfs_hash,
        blockchain_tx_hash=blockchain_tx_hash,
        verification_status="success" if blockchain_tx_hash else "failed"
    )


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List user's documents"""
    documents = db.query(Document).filter(
        Document.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return documents


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete file from storage
    try:
        os.remove(document.file_path)
    except OSError:
        pass  # File might not exist
    
    # Delete from database
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}


@router.post("/{document_id}/verify")
async def verify_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Verify a document's authenticity"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Verify file hash
    current_hash = file_service.calculate_file_hash(document.file_path)
    is_valid = current_hash == document.file_hash
    
    # Create verification record
    verification = Verification(
        document_id=document.id,
        user_id=current_user.id,
        verification_type="verify",
        status="success" if is_valid else "failed",
        verification_metadata=f'{{"hash_match": {is_valid}}}'
    )
    
    db.add(verification)
    db.commit()
    
    return {
        "document_id": document_id,
        "is_valid": is_valid,
        "file_hash": current_hash,
        "stored_hash": document.file_hash,
        "verification_status": "success" if is_valid else "failed"
    } 