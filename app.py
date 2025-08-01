#!/usr/bin/env python3
"""
Digital Shadow - Blockchain Document Verification System
Backend API Server
"""

import os
import argparse
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
from dotenv import load_dotenv

from api.routes import auth, documents, users, verification
from core.config import settings
from core.database import engine, Base
from core.security import get_current_user

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Digital Shadow API Server...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Digital Shadow API Server...")

def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title="Digital Shadow API",
        description="Blockchain Document Verification System API",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        lifespan=lifespan
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API routes
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(users.router, prefix="/api/users", tags=["Users"])
    app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
    app.include_router(verification.router, prefix="/api/verification", tags=["Verification"])
    
    # Health check endpoint
    @app.get("/api/health")
    async def health_check():
        return {"status": "healthy", "service": "Digital Shadow API"}
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {
            "message": "Digital Shadow - Blockchain Document Verification System",
            "version": "1.0.0",
            "docs": "/api/docs"
        }
    
    return app

app = create_app()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Digital Shadow API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    parser.add_argument("--production", action="store_true", help="Run in production mode")
    
    args = parser.parse_args()
    
    if args.production:
        # Production settings
        uvicorn.run(
            "app:app",
            host=args.host,
            port=args.port,
            workers=4,
            log_level="info"
        )
    else:
        # Development settings
        uvicorn.run(
            "app:app",
            host=args.host,
            port=args.port,
            reload=args.reload,
            log_level="debug"
        ) 