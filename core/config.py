"""
Configuration settings for Digital Shadow API
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Digital Shadow API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    # Security
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:8080", "http://localhost:3000"],
        env="ALLOWED_ORIGINS"
    )
    
    # Blockchain
    ETHEREUM_RPC_URL: str = Field(default="http://localhost:8545", env="ETHEREUM_RPC_URL")
    CONTRACT_ADDRESS: Optional[str] = Field(default=None, env="CONTRACT_ADDRESS")
    PRIVATE_KEY: Optional[str] = Field(default=None, env="PRIVATE_KEY")
    
    # IPFS
    IPFS_NODE_URL: str = Field(default="http://localhost:5001", env="IPFS_NODE_URL")
    
    # File Storage
    UPLOAD_DIR: str = Field(default="./uploads", env="UPLOAD_DIR")
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, env="MAX_FILE_SIZE")  # 10MB
    ALLOWED_EXTENSIONS: List[str] = Field(
        default=[".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
        env="ALLOWED_EXTENSIONS"
    )
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # Email
    SMTP_HOST: Optional[str] = Field(default=None, env="SMTP_HOST")
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    SMTP_USER: Optional[str] = Field(default=None, env="SMTP_USER")
    SMTP_PASSWORD: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings() 