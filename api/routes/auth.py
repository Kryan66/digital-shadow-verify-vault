"""
Authentication routes
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from core.database import get_db, User
from core.security import verify_password, get_password_hash, create_access_token, get_current_active_user
from core.config import settings

router = APIRouter()


class UserCreate(BaseModel):
    """User registration model"""
    email: EmailStr
    username: str
    password: str
    full_name: str = None


class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str
    user_id: int
    email: str
    username: str


class UserResponse(BaseModel):
    """User response model"""
    id: int
    email: str
    username: str
    full_name: str = None
    is_active: bool
    is_verified: bool
    created_at: str

    class Config:
        from_attributes = True


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=db_user.id,
        email=db_user.email,
        username=db_user.username
    )


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login user"""
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        username=user.username
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user


@router.post("/refresh")
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh access token"""
    access_token = create_access_token(data={"sub": str(current_user.id)})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=current_user.id,
        email=current_user.email,
        username=current_user.username
    ) 