"""
Blockchain service for Ethereum integration
"""

import asyncio
from typing import Optional
from web3 import Web3
from web3.exceptions import ContractLogicError
from core.config import settings
import json


class BlockchainService:
    """Service for blockchain operations"""
    
    def __init__(self):
        self.w3 = None
        self.contract = None
        self._initialize_web3()
    
    def _initialize_web3(self):
        """Initialize Web3 connection and contract"""
        try:
            # Initialize Web3
            self.w3 = Web3(Web3.HTTPProvider(settings.ETHEREUM_RPC_URL))
            
            # Check if connected
            if not self.w3.is_connected():
                print("Warning: Could not connect to Ethereum network")
                return
            
            # Initialize contract if address is provided
            if settings.CONTRACT_ADDRESS:
                # This would be the actual contract ABI - simplified for demo
                contract_abi = [
                    {
                        "inputs": [
                            {"internalType": "bytes32", "name": "documentHash", "type": "bytes32"},
                            {"internalType": "string", "name": "ipfsHash", "type": "string"},
                            {"internalType": "uint256", "name": "userId", "type": "uint256"}
                        ],
                        "name": "storeDocument",
                        "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {"internalType": "bytes32", "name": "documentHash", "type": "bytes32"},
                            {"internalType": "bytes32", "name": "txHash", "type": "bytes32"}
                        ],
                        "name": "verifyDocument",
                        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ]
                
                self.contract = self.w3.eth.contract(
                    address=settings.CONTRACT_ADDRESS,
                    abi=contract_abi
                )
                
        except Exception as e:
            print(f"Error initializing blockchain service: {e}")
    
    async def store_document_hash(
        self, 
        file_hash: str, 
        ipfs_hash: Optional[str], 
        user_id: int
    ) -> Optional[str]:
        """Store document hash on blockchain"""
        if not self.w3 or not self.w3.is_connected():
            print("Blockchain not connected - skipping storage")
            return None
        
        try:
            # Convert file hash to bytes32
            document_hash = self.w3.to_bytes(hexstr=file_hash)
            
            # Prepare transaction
            transaction = self.contract.functions.storeDocument(
                document_hash,
                ipfs_hash or "",
                user_id
            ).build_transaction({
                'from': self.w3.eth.accounts[0] if self.w3.eth.accounts else None,
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(
                    self.w3.eth.accounts[0] if self.w3.eth.accounts else None
                ),
            })
            
            # Sign and send transaction
            if settings.PRIVATE_KEY:
                signed_txn = self.w3.eth.account.sign_transaction(
                    transaction, settings.PRIVATE_KEY
                )
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            else:
                # For demo purposes, return a mock transaction hash
                tx_hash = self.w3.to_hex(self.w3.keccak(f"{file_hash}{ipfs_hash}{user_id}".encode()))
            
            # Wait for transaction receipt
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return self.w3.to_hex(tx_hash)
            
        except Exception as e:
            print(f"Error storing document on blockchain: {e}")
            return None
    
    async def verify_document_hash(
        self, 
        file_hash: str, 
        transaction_hash: str
    ) -> bool:
        """Verify document hash on blockchain"""
        if not self.w3 or not self.w3.is_connected():
            print("Blockchain not connected - skipping verification")
            return False
        
        try:
            # Convert hashes to bytes32
            document_hash = self.w3.to_bytes(hexstr=file_hash)
            tx_hash = self.w3.to_bytes(hexstr=transaction_hash)
            
            # Call contract function
            is_valid = self.contract.functions.verifyDocument(
                document_hash, tx_hash
            ).call()
            
            return is_valid
            
        except Exception as e:
            print(f"Error verifying document on blockchain: {e}")
            return False
    
    def get_network_info(self) -> dict:
        """Get blockchain network information"""
        if not self.w3 or not self.w3.is_connected():
            return {"connected": False}
        
        try:
            return {
                "connected": True,
                "network_id": self.w3.eth.chain_id,
                "latest_block": self.w3.eth.block_number,
                "gas_price": self.w3.eth.gas_price,
                "contract_address": settings.CONTRACT_ADDRESS
            }
        except Exception as e:
            return {"connected": False, "error": str(e)} 