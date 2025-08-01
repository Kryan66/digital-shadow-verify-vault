
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Upload, CheckCircle, AlertTriangle, Clock } from "lucide-react";

// Document type definition
interface Document {
  id: string;
  type: string;
  documentId: string;
  issueDate: string;
  fileName: string;
  uploadDate: string;
  status: "verified" | "rejected" | "pending";
}

const DocumentStatusBadge = ({ status }: { status: Document["status"] }) => {
  if (status === "verified") {
    return (
      <div className="flex items-center text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs">
        <CheckCircle size={12} className="mr-1" />
        <span>Verified</span>
      </div>
    );
  } else if (status === "rejected") {
    return (
      <div className="flex items-center text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs">
        <AlertTriangle size={12} className="mr-1" />
        <span>Rejected</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs">
        <Clock size={12} className="mr-1" />
        <span>Pending</span>
      </div>
    );
  }
};

const getDocumentTypeName = (type: string) => {
  switch (type) {
    case "pan": return "PAN Card";
    case "aadhar": return "Aadhar Card";
    case "voter": return "Voter ID";
    case "birth": return "Birth Certificate";
    default: return type;
  }
};

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get documents from localStorage
    const fetchDocuments = () => {
      setIsLoading(true);
      const storedDocs = localStorage.getItem("documents");
      
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      } else {
        // For demo, set some mock data if no documents exist
        const mockDocuments: Document[] = [
          {
            id: "doc-1",
            type: "pan",
            documentId: "ABCDE1234F",
            issueDate: "2022-05-15",
            fileName: "pan_card.pdf",
            uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "verified",
          },
          {
            id: "doc-2",
            type: "aadhar",
            documentId: "1234 5678 9012",
            issueDate: "2021-08-22",
            fileName: "aadhar_card.pdf",
            uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending",
          },
        ];
        
        localStorage.setItem("documents", JSON.stringify(mockDocuments));
        setDocuments(mockDocuments);
      }
      
      setIsLoading(false);
    };
    
    setTimeout(fetchDocuments, 500);
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    getDocumentTypeName(doc.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          <p className="text-cyber-gray">
            Manage and view all your verified documents
          </p>
        </div>
        
        <Link to="/dashboard/upload" className="mt-4 sm:mt-0">
          <Button className="cyber-button flex items-center gap-2">
            <Upload size={16} />
            <span>Upload Document</span>
          </Button>
        </Link>
      </div>
      
      <CyberCard>
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-gray" />
            <Input
              placeholder="Search documents..."
              className="pl-10 bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse">Loading documents...</div>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cyber-purple/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Upload Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-cyber-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-purple/10">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-black/20">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-cyber-purple/10 text-cyber-purple mr-3">
                          <FileText size={16} />
                        </div>
                        <span>{getDocumentTypeName(doc.type)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {doc.documentId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDate(doc.issueDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDate(doc.uploadDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <DocumentStatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <Link to={`/dashboard/documents/${doc.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-cyber-purple/10 text-cyber-purple mx-auto w-fit mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No documents found</h3>
            <p className="text-cyber-gray mb-6">
              {searchTerm 
                ? "No documents match your search criteria. Try a different search term."
                : "You haven't uploaded any documents yet."}
            </p>
            {!searchTerm && (
              <Link to="/dashboard/upload">
                <Button className="cyber-button">
                  Upload Your First Document
                </Button>
              </Link>
            )}
          </div>
        )}
      </CyberCard>
    </div>
  );
};

export default Documents;
