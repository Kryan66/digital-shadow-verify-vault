"""
Verification routes
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db, User, Verification, Document
from core.security import get_current_active_user
from services.blockchain_service import BlockchainService

router = APIRouter()
blockchain_service = BlockchainService()


class VerificationResponse(BaseModel):
    """Verification response model"""
    id: int
    document_id: int
    verification_type: str
    status: str
    blockchain_tx_hash: Optional[str]
    ipfs_hash: Optional[str]
    verification_metadata: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


class VerificationHistoryResponse(BaseModel):
    """Verification history response model"""
    verifications: List[VerificationResponse]
    total_count: int


@router.get("/history", response_model=VerificationHistoryResponse)
async def get_verification_history(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's verification history"""
    verifications = db.query(Verification).filter(
        Verification.user_id == current_user.id
    ).order_by(Verification.created_at.desc()).offset(skip).limit(limit).all()
    
    total_count = db.query(Verification).filter(
        Verification.user_id == current_user.id
    ).count()
    
    return VerificationHistoryResponse(
        verifications=verifications,
        total_count=total_count
    )


@router.get("/document/{document_id}", response_model=List[VerificationResponse])
async def get_document_verification_history(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get verification history for a specific document"""
    # Check if user owns the document
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    verifications = db.query(Verification).filter(
        Verification.document_id == document_id
    ).order_by(Verification.created_at.desc()).all()
    
    return verifications


@router.post("/verify-blockchain/{document_id}")
async def verify_document_on_blockchain(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Verify document authenticity on blockchain"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if not document.blockchain_tx_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document not stored on blockchain"
        )
    
    try:
        # Verify on blockchain
        is_valid = await blockchain_service.verify_document_hash(
            document.file_hash,
            document.blockchain_tx_hash
        )
        
        # Create verification record
        verification = Verification(
            document_id=document.id,
            user_id=current_user.id,
            verification_type="blockchain_verify",
            status="success" if is_valid else "failed",
            blockchain_tx_hash=document.blockchain_tx_hash,
            verification_metadata=f'{{"blockchain_verified": {is_valid}}}'
        )
        
        db.add(verification)
        db.commit()
        
        return {
            "document_id": document_id,
            "blockchain_verified": is_valid,
            "transaction_hash": document.blockchain_tx_hash,
            "verification_status": "success" if is_valid else "failed"
        }
        
    except Exception as e:
        # Create failed verification record
        verification = Verification(
            document_id=document.id,
            user_id=current_user.id,
            verification_type="blockchain_verify",
            status="failed",
            blockchain_tx_hash=document.blockchain_tx_hash,
            verification_metadata=f'{{"error": "{str(e)}"}}'
        )
        
        db.add(verification)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Blockchain verification failed: {str(e)}"
        )


@router.get("/stats")
async def get_verification_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get verification statistics for the user"""
    total_verifications = db.query(Verification).filter(
        Verification.user_id == current_user.id
    ).count()
    
    successful_verifications = db.query(Verification).filter(
        Verification.user_id == current_user.id,
        Verification.status == "success"
    ).count()
    
    failed_verifications = db.query(Verification).filter(
        Verification.user_id == current_user.id,
        Verification.status == "failed"
    ).count()
    
    total_documents = db.query(Document).filter(
        Document.owner_id == current_user.id
    ).count()
    
    verified_documents = db.query(Document).filter(
        Document.owner_id == current_user.id,
        Document.is_verified == True
    ).count()
    
    return {
        "total_verifications": total_verifications,
        "successful_verifications": successful_verifications,
        "failed_verifications": failed_verifications,
        "success_rate": (successful_verifications / total_verifications * 100) if total_verifications > 0 else 0,
        "total_documents": total_documents,
        "verified_documents": verified_documents,
        "verification_coverage": (verified_documents / total_documents * 100) if total_documents > 0 else 0
    } 