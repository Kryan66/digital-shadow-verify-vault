#!/usr/bin/env python3
"""
Digital Shadow - Startup Script
Runs both backend and frontend development servers
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

def run_backend():
    """Run the Python backend server"""
    print("🚀 Starting Python backend server...")
    try:
        subprocess.run([sys.executable, "app.py", "--reload"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Backend server error: {e}")

def run_frontend():
    """Run the React frontend development server"""
    print("🚀 Starting React frontend server...")
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Frontend server error: {e}")

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import fastapi
        import uvicorn
        print("✅ Python dependencies found")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False
    
    # Check Node.js dependencies
    if not Path("node_modules").exists():
        print("❌ Node.js dependencies not found")
        print("Please run: npm install")
        return False
    
    print("✅ Node.js dependencies found")
    return True

def setup_environment():
    """Setup environment variables"""
    print("🔧 Setting up environment...")
    
    # Create .env file if it doesn't exist
    if not Path(".env").exists():
        print("📝 Creating .env file from template...")
        try:
            with open("env.example", "r") as f:
                env_content = f.read()
            
            with open(".env", "w") as f:
                f.write(env_content)
            
            print("✅ .env file created. Please update with your configuration.")
        except FileNotFoundError:
            print("⚠️  env.example not found. Creating basic .env file...")
            with open(".env", "w") as f:
                f.write("SECRET_KEY=your-secret-key-here\nDATABASE_URL=sqlite:///./digital_shadow.db\n")
    
    # Create uploads directory
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    print("✅ Uploads directory ready")

def main():
    """Main startup function"""
    print("🌐 Digital Shadow - Blockchain Document Verification System")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Setup environment
    setup_environment()
    
    print("\n🎯 Starting development servers...")
    print("📱 Frontend: http://localhost:8080")
    print("🔧 Backend:  http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/api/docs")
    print("\nPress Ctrl+C to stop all servers")
    print("-" * 60)
    
    # Start servers in separate threads
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    frontend_thread = threading.Thread(target=run_frontend, daemon=True)
    
    try:
        backend_thread.start()
        time.sleep(2)  # Give backend time to start
        frontend_thread.start()
        
        # Wait for both threads
        backend_thread.join()
        frontend_thread.join()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        sys.exit(0)

if __name__ == "__main__":
    main() 