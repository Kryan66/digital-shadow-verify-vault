"""
File service for handling file operations
"""

import os
import hashlib
import shutil
from typing import Optional
from pathlib import Path
from fastapi import UploadFile
from core.config import settings


class FileService:
    """Service for file operations"""
    
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self._ensure_upload_directory()
    
    def _ensure_upload_directory(self):
        """Ensure upload directory exists"""
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    def is_valid_file(self, file: UploadFile) -> bool:
        """Check if file is valid (type and size)"""
        # Check file size
        if file.size > settings.MAX_FILE_SIZE:
            return False
        
        # Check file extension
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            return False
        
        return True
    
    async def save_file(self, file: UploadFile, user_id: int) -> str:
        """Save uploaded file to disk"""
        # Create user-specific directory
        user_dir = self.upload_dir / str(user_id)
        user_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{hashlib.md5(f'{file.filename}{user_id}'.encode()).hexdigest()}{file_extension}"
        file_path = user_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return str(file_path)
    
    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file"""
        sha256_hash = hashlib.sha256()
        
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        
        return sha256_hash.hexdigest()
    
    def get_file_info(self, file_path: str) -> dict:
        """Get file information"""
        if not os.path.exists(file_path):
            return None
        
        stat = os.stat(file_path)
        
        return {
            "path": file_path,
            "size": stat.st_size,
            "created": stat.st_ctime,
            "modified": stat.st_mtime,
            "hash": self.calculate_file_hash(file_path)
        }
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from disk"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")
            return False
    
    def copy_file(self, source_path: str, destination_path: str) -> bool:
        """Copy file from source to destination"""
        try:
            shutil.copy2(source_path, destination_path)
            return True
        except Exception as e:
            print(f"Error copying file from {source_path} to {destination_path}: {e}")
            return False
    
    def move_file(self, source_path: str, destination_path: str) -> bool:
        """Move file from source to destination"""
        try:
            shutil.move(source_path, destination_path)
            return True
        except Exception as e:
            print(f"Error moving file from {source_path} to {destination_path}: {e}")
            return False
    
    def get_file_size(self, file_path: str) -> int:
        """Get file size in bytes"""
        try:
            return os.path.getsize(file_path)
        except OSError:
            return 0
    
    def format_file_size(self, size_bytes: int) -> str:
        """Format file size in human readable format"""
        if size_bytes == 0:
            return "0B"
        
        size_names = ["B", "KB", "MB", "GB", "TB"]
        i = 0
        while size_bytes >= 1024 and i < len(size_names) - 1:
            size_bytes /= 1024.0
            i += 1
        
        return f"{size_bytes:.1f}{size_names[i]}"
    
    def cleanup_old_files(self, max_age_days: int = 30) -> int:
        """Clean up old files from upload directory"""
        import time
        current_time = time.time()
        max_age_seconds = max_age_days * 24 * 60 * 60
        deleted_count = 0
        
        for root, dirs, files in os.walk(self.upload_dir):
            for file in files:
                file_path = os.path.join(root, file)
                try:
                    file_age = current_time - os.path.getmtime(file_path)
                    if file_age > max_age_seconds:
                        os.remove(file_path)
                        deleted_count += 1
                except OSError:
                    continue
        
        return deleted_count 