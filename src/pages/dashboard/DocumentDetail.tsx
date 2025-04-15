
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Eye, 
  Calendar,
  FileCheck,
  Ban
} from "lucide-react";

// Document type definition (same as in Documents.tsx)
interface Document {
  id: string;
  type: string;
  documentId: string;
  issueDate: string;
  fileName: string;
  uploadDate: string;
  status: "verified" | "rejected" | "pending";
}

// Mock blockchain verification data
interface VerificationData {
  blockchainId: string;
  timestamp: string;
  networkName: string;
  hash: string;
  verifiedBy: string;
}

const getDocumentTypeName = (type: string) => {
  switch (type) {
    case "pan": return "PAN Card";
    case "aadhar": return "Aadhar Card";
    case "voter": return "Voter ID";
    case "birth": return "Birth Certificate";
    default: return type;
  }
};

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get document from localStorage
  useEffect(() => {
    if (!id) return;
    
    const fetchDocument = () => {
      setIsLoading(true);
      const storedDocs = localStorage.getItem("documents");
      
      if (storedDocs) {
        const parsedDocs: Document[] = JSON.parse(storedDocs);
        const foundDoc = parsedDocs.find(doc => doc.id === id);
        
        if (foundDoc) {
          setDocument(foundDoc);
          
          // Mock verification data for verified documents
          if (foundDoc.status === "verified") {
            setVerificationData({
              blockchainId: "0x" + Math.random().toString(16).substring(2, 12),
              timestamp: new Date().toISOString(),
              networkName: "Ethereum Mainnet",
              hash: "0x" + Math.random().toString(16).substring(2, 66),
              verifiedBy: "Digital Shadow Authority",
            });
          }
        }
      }
      
      setIsLoading(false);
    };
    
    setTimeout(fetchDocument, 500);
  }, [id]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse">Loading document details...</div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard/documents" className="text-cyber-gray hover:text-white flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Documents</span>
          </Link>
        </div>
        
        <CyberCard>
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
            <p className="text-cyber-gray mb-6">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/dashboard/documents">
              <Button variant="outline" className="border-cyber-purple/50">
                View All Documents
              </Button>
            </Link>
          </div>
        </CyberCard>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard/documents" className="text-cyber-gray hover:text-white flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          <span>Back to Documents</span>
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{getDocumentTypeName(document.type)}</h1>
          <p className="text-cyber-gray">Document ID: {document.documentId}</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center">
          {document.status === "verified" && (
            <div className="flex items-center text-green-500 bg-green-500/10 px-3 py-1.5 rounded mr-4">
              <CheckCircle size={16} className="mr-2" />
              <span>Verified</span>
            </div>
          )}
          
          {document.status === "rejected" && (
            <div className="flex items-center text-red-500 bg-red-500/10 px-3 py-1.5 rounded mr-4">
              <AlertTriangle size={16} className="mr-2" />
              <span>Rejected</span>
            </div>
          )}
          
          {document.status === "pending" && (
            <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded mr-4">
              <Clock size={16} className="mr-2" />
              <span>Pending</span>
            </div>
          )}
          
          <Button variant="outline" className="border-cyber-purple/50 flex items-center gap-2">
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CyberCard>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-cyber-blue/10 text-cyber-blue mr-3">
              <Calendar size={20} />
            </div>
            <h3 className="text-lg font-medium">Issue Date</h3>
          </div>
          <p className="text-xl">{formatDate(document.issueDate)}</p>
        </CyberCard>
        
        <CyberCard>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-cyber-blue/10 text-cyber-blue mr-3">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-medium">File Name</h3>
          </div>
          <p className="text-xl truncate">{document.fileName}</p>
        </CyberCard>
        
        <CyberCard>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-cyber-blue/10 text-cyber-blue mr-3">
              <Eye size={20} />
            </div>
            <h3 className="text-lg font-medium">Upload Date</h3>
          </div>
          <p className="text-xl">{formatDate(document.uploadDate)}</p>
        </CyberCard>
      </div>
      
      <CyberCard>
        <div className="flex items-center mb-6">
          <Shield size={24} className="text-cyber-purple mr-3" />
          <h2 className="text-2xl font-bold">Verification Status</h2>
        </div>
        
        {document.status === "verified" && (
          <div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <CheckCircle size={24} className="text-green-500 shrink-0 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-green-400 mb-2">Document Verified</h3>
                  <p className="text-cyber-gray">
                    This document has been verified as authentic using blockchain technology. 
                    The verification details are recorded on the blockchain and cannot be tampered with.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-black/20">
              <h3 className="text-lg font-medium mb-4">Blockchain Verification Details</h3>
              
              {verificationData && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cyber-gray">Blockchain ID:</span>
                    <span className="font-mono bg-black/30 py-1 px-2 rounded">{verificationData.blockchainId}</span>
                  </div>
                  
                  <Separator className="bg-cyber-purple/10" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyber-gray">Network:</span>
                    <span>{verificationData.networkName}</span>
                  </div>
                  
                  <Separator className="bg-cyber-purple/10" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyber-gray">Timestamp:</span>
                    <span>{formatDate(verificationData.timestamp)}</span>
                  </div>
                  
                  <Separator className="bg-cyber-purple/10" />
                  
                  <div className="flex justify-between">
                    <span className="text-cyber-gray">Document Hash:</span>
                    <span className="font-mono text-xs bg-black/30 py-1 px-2 rounded max-w-[50%] truncate">
                      {verificationData.hash}
                    </span>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-cyber-purple/20 flex items-center justify-center">
                    <FileCheck size={20} className="text-green-500 mr-2" />
                    <span>Verified by {verificationData.verifiedBy}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {document.status === "rejected" && (
          <div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle size={24} className="text-red-500 shrink-0 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-red-400 mb-2">Verification Failed</h3>
                  <p className="text-cyber-gray">
                    This document could not be verified as authentic. 
                    This may be due to document tampering or because the document does not match official records.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-black/20">
              <h3 className="text-lg font-medium mb-4">Verification Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Ban size={18} className="text-red-500 mr-2" />
                  <span>Document hash does not match official records</span>
                </div>
                
                <div className="flex items-center">
                  <Ban size={18} className="text-red-500 mr-2" />
                  <span>Document structure has been altered</span>
                </div>
                
                <div className="mt-6 pt-4 border-t border-cyber-purple/20 text-center">
                  <p className="text-cyber-gray">
                    For assistance, please contact our support team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {document.status === "pending" && (
          <div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <Clock size={24} className="text-yellow-500 shrink-0 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-yellow-400 mb-2">Verification in Progress</h3>
                  <p className="text-cyber-gray">
                    This document is currently being verified through our blockchain verification system. 
                    This process typically takes 10-15 minutes to complete.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-black/20">
              <h3 className="text-lg font-medium mb-4">Verification Process</h3>
              
              <div className="space-y-8">
                <div className="relative">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-500/20 text-green-500 z-10">
                      <CheckCircle size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Document Uploaded</p>
                      <p className="text-sm text-cyber-gray">{formatDate(document.uploadDate)}</p>
                    </div>
                  </div>
                  <div className="absolute top-10 left-4 bottom-0 w-0.5 bg-cyber-purple/20 -z-10"></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-500/20 text-green-500 z-10">
                      <CheckCircle size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Document Processing</p>
                      <p className="text-sm text-cyber-gray">Document scanned and prepared for verification</p>
                    </div>
                  </div>
                  <div className="absolute top-10 left-4 bottom-0 w-0.5 bg-cyber-purple/20 -z-10"></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-500 z-10">
                      <Clock size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Blockchain Verification</p>
                      <p className="text-sm text-cyber-gray">Verifying document authenticity on blockchain</p>
                    </div>
                  </div>
                  <div className="absolute top-10 left-4 bottom-0 w-0.5 bg-cyber-purple/20 -z-10"></div>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-cyber-purple/20 text-cyber-gray z-10">
                      <Shield size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-cyber-gray">Verification Complete</p>
                      <p className="text-sm text-cyber-gray">Final status will be available soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CyberCard>
    </div>
  );
};

export default DocumentDetail;
