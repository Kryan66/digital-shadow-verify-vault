"""
IPFS service for decentralized file storage
"""

import asyncio
from typing import Optional
import ipfshttpclient
from core.config import settings


class IPFSService:
    """Service for IPFS operations"""
    
    def __init__(self):
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize IPFS client"""
        try:
            self.client = ipfshttpclient.connect(settings.IPFS_NODE_URL)
            # Test connection
            self.client.version()
            print("IPFS client initialized successfully")
        except Exception as e:
            print(f"Error initializing IPFS client: {e}")
            self.client = None
    
    async def upload_file(self, file_path: str) -> Optional[str]:
        """Upload file to IPFS"""
        if not self.client:
            print("IPFS client not available - skipping upload")
            return None
        
        try:
            # Upload file to IPFS
            result = self.client.add(file_path)
            
            # Return the IPFS hash
            if isinstance(result, list):
                return result[0]['Hash']
            else:
                return result['Hash']
                
        except Exception as e:
            print(f"Error uploading file to IPFS: {e}")
            return None
    
    async def download_file(self, ipfs_hash: str, output_path: str) -> bool:
        """Download file from IPFS"""
        if not self.client:
            print("IPFS client not available - skipping download")
            return False
        
        try:
            # Download file from IPFS
            self.client.get(ipfs_hash, output_path)
            return True
            
        except Exception as e:
            print(f"Error downloading file from IPFS: {e}")
            return False
    
    async def get_file_info(self, ipfs_hash: str) -> Optional[dict]:
        """Get file information from IPFS"""
        if not self.client:
            print("IPFS client not available")
            return None
        
        try:
            # Get file stats
            stats = self.client.files.stat(f"/ipfs/{ipfs_hash}")
            
            return {
                "hash": ipfs_hash,
                "size": stats.get("Size", 0),
                "type": stats.get("Type", "unknown"),
                "cumulative_size": stats.get("CumulativeSize", 0)
            }
            
        except Exception as e:
            print(f"Error getting file info from IPFS: {e}")
            return None
    
    def get_node_info(self) -> dict:
        """Get IPFS node information"""
        if not self.client:
            return {"connected": False}
        
        try:
            # Get node ID
            node_id = self.client.id()
            
            return {
                "connected": True,
                "node_id": node_id.get("ID", ""),
                "addresses": node_id.get("Addresses", []),
                "protocol_version": node_id.get("ProtocolVersion", ""),
                "agent_version": node_id.get("AgentVersion", "")
            }
            
        except Exception as e:
            return {"connected": False, "error": str(e)}
    
    async def pin_file(self, ipfs_hash: str) -> bool:
        """Pin file to IPFS node"""
        if not self.client:
            print("IPFS client not available - skipping pin")
            return False
        
        try:
            # Pin the file
            self.client.pin.add(ipfs_hash)
            return True
            
        except Exception as e:
            print(f"Error pinning file to IPFS: {e}")
            return False
    
    async def unpin_file(self, ipfs_hash: str) -> bool:
        """Unpin file from IPFS node"""
        if not self.client:
            print("IPFS client not available - skipping unpin")
            return False
        
        try:
            # Unpin the file
            self.client.pin.rm(ipfs_hash)
            return True
            
        except Exception as e:
            print(f"Error unpinning file from IPFS: {e}")
            return False 