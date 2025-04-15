
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Upload,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// History entry type
interface HistoryEntry {
  id: string;
  documentId: string;
  documentType: string;
  verificationDate: string;
  status: "verified" | "rejected" | "pending";
  documentName: string;
}

// Mock history data generator
const generateMockHistory = (): HistoryEntry[] => {
  const documentTypes = ["pan", "aadhar", "voter", "birth"];
  const statuses: ("verified" | "rejected" | "pending")[] = ["verified", "rejected", "pending"];
  const mockHistory: HistoryEntry[] = [];
  
  // Generate random entries
  for (let i = 0; i < 15; i++) {
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
    
    mockHistory.push({
      id: `hist-${i + 1}`,
      documentId: `doc-${i + 1}`,
      documentType: docType,
      verificationDate: date.toISOString(),
      status: status,
      documentName: `${getDocumentTypeName(docType)}_${Math.floor(Math.random() * 10000)}.pdf`,
    });
  }
  
  // Sort by date (newest first)
  return mockHistory.sort((a, b) => 
    new Date(b.verificationDate).getTime() - new Date(a.verificationDate).getTime()
  );
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

// Status badges component
const StatusBadge = ({ status }: { status: HistoryEntry["status"] }) => {
  if (status === "verified") {
    return (
      <div className="flex items-center text-green-500">
        <CheckCircle size={16} className="mr-1" />
        <span>Verified</span>
      </div>
    );
  } else if (status === "rejected") {
    return (
      <div className="flex items-center text-red-500">
        <AlertTriangle size={16} className="mr-1" />
        <span>Rejected</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-yellow-500">
        <Clock size={16} className="mr-1" />
        <span>Pending</span>
      </div>
    );
  }
};

const VerificationHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch verification history
    const fetchHistory = () => {
      setIsLoading(true);
      
      // Check if we have history in localStorage
      const storedHistory = localStorage.getItem("verificationHistory");
      
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        // Generate mock data
        const mockHistory = generateMockHistory();
        localStorage.setItem("verificationHistory", JSON.stringify(mockHistory));
        setHistory(mockHistory);
      }
      
      setIsLoading(false);
    };
    
    setTimeout(fetchHistory, 800);
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter and sort history entries
  const filteredHistory = history
    .filter(entry => filterStatus === "all" || entry.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.verificationDate).getTime();
      const dateB = new Date(b.verificationDate).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "desc" ? "asc" : "desc");
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Verification History</h1>
          <p className="text-cyber-gray">
            Track all your document verification activities
          </p>
        </div>
        
        <Link to="/dashboard/upload" className="mt-4 sm:mt-0">
          <Button className="cyber-button flex items-center gap-2">
            <Upload size={16} />
            <span>Upload New Document</span>
          </Button>
        </Link>
      </div>
      
      <CyberCard>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <Button 
              variant="outline" 
              className="border-cyber-purple/30 hover:border-cyber-purple/80 flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span>Filter & Sort</span>
              {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          <div className="text-sm text-cyber-gray">
            Showing {filteredHistory.length} of {history.length} entries
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="mb-6 p-4 bg-black/20 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-sm font-medium">Filter by Status</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className={filterStatus === "all" ? "bg-cyber-purple" : "border-cyber-purple/30"}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterStatus === "verified" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("verified")}
                    className={filterStatus === "verified" ? "bg-green-600" : "border-green-500/30 text-green-500"}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Verified
                  </Button>
                  <Button 
                    variant={filterStatus === "rejected" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("rejected")}
                    className={filterStatus === "rejected" ? "bg-red-600" : "border-red-500/30 text-red-500"}
                  >
                    <AlertTriangle size={14} className="mr-1" />
                    Rejected
                  </Button>
                  <Button 
                    variant={filterStatus === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("pending")}
                    className={filterStatus === "pending" ? "bg-yellow-600" : "border-yellow-500/30 text-yellow-500"}
                  >
                    <Clock size={14} className="mr-1" />
                    Pending
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="mb-2 text-sm font-medium">Sort by Date</p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={toggleSortDirection}
                  className="border-cyber-purple/30 hover:border-cyber-purple/80 flex items-center gap-2"
                >
                  <Calendar size={14} />
                  <span>{sortDirection === "desc" ? "Newest First" : "Oldest First"}</span>
                  {sortDirection === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse">Loading verification history...</div>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cyber-purple/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Verification Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyber-gray uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-cyber-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-purple/10">
                {filteredHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-black/20">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-cyber-purple/10 text-cyber-purple mr-3">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="font-medium">{getDocumentTypeName(entry.documentType)}</div>
                          <div className="text-sm text-cyber-gray truncate max-w-[200px]">{entry.documentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDate(entry.verificationDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <Link to={`/dashboard/documents/${entry.documentId}`}>
                        <Button variant="ghost" size="sm">
                          View Document
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
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No verification records found</h3>
            <p className="text-cyber-gray mb-6">
              {filterStatus !== "all" 
                ? `No documents with "${filterStatus}" status found. Try a different filter.`
                : "You haven't verified any documents yet."}
            </p>
            {filterStatus === "all" && (
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

export default VerificationHistory;
