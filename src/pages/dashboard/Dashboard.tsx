
import { useState, useEffect } from "react";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { FileText, Upload, History, CheckCircle, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

// Mock user data
interface UserData {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

// Mock verification stats
interface VerificationStats {
  totalDocuments: number;
  verifiedDocuments: number;
  pendingVerifications: number;
  recentVerifications: Array<{
    id: string;
    documentType: string;
    timestamp: string;
    status: "verified" | "rejected";
  }>;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<VerificationStats>({
    totalDocuments: 0,
    verifiedDocuments: 0,
    pendingVerifications: 0,
    recentVerifications: [],
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
    }
    
    // Mock fetching stats data
    setTimeout(() => {
      setStats({
        totalDocuments: 5,
        verifiedDocuments: 3,
        pendingVerifications: 2,
        recentVerifications: [
          {
            id: "doc-1",
            documentType: "PAN Card",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            status: "verified",
          },
          {
            id: "doc-2",
            documentType: "Aadhar Card",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            status: "verified",
          },
          {
            id: "doc-3",
            documentType: "Birth Certificate",
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            status: "rejected",
          },
        ],
      });
    }, 500);
  }, []);
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  };
  
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {userData.name || "User"}</h1>
        <p className="text-cyber-gray">Manage and verify your documents securely with blockchain technology</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CyberCard>
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-cyber-purple/20 text-cyber-purple">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Documents</h3>
              <p className="text-2xl font-bold">{stats.totalDocuments}</p>
            </div>
          </div>
        </CyberCard>
        
        <CyberCard>
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-green-500/20 text-green-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Verified Documents</h3>
              <p className="text-2xl font-bold">{stats.verifiedDocuments}</p>
            </div>
          </div>
        </CyberCard>
        
        <CyberCard>
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-yellow-500/20 text-yellow-500">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pending Verifications</h3>
              <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
            </div>
          </div>
        </CyberCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CyberCard title="Quick Actions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/dashboard/upload">
              <Button variant="outline" className="w-full border-cyber-purple/30 hover:border-cyber-purple/80 flex items-center gap-2">
                <Upload size={16} />
                <span>Upload New Document</span>
              </Button>
            </Link>
            
            <Link to="/dashboard/documents">
              <Button variant="outline" className="w-full border-cyber-purple/30 hover:border-cyber-purple/80 flex items-center gap-2">
                <FileText size={16} />
                <span>View All Documents</span>
              </Button>
            </Link>
            
            <Link to="/dashboard/history">
              <Button variant="outline" className="w-full border-cyber-purple/30 hover:border-cyber-purple/80 flex items-center gap-2">
                <History size={16} />
                <span>Verification History</span>
              </Button>
            </Link>
          </div>
        </CyberCard>
        
        <CyberCard title="Recent Verifications">
          {stats.recentVerifications.length > 0 ? (
            <div className="space-y-4">
              {stats.recentVerifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-3 bg-black/20 rounded-md">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      verification.status === "verified" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-red-500/20 text-red-500"
                    }`}>
                      {verification.status === "verified" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <ShieldAlert size={16} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{verification.documentType}</p>
                      <p className="text-sm text-cyber-gray">{formatRelativeTime(verification.timestamp)}</p>
                    </div>
                  </div>
                  <Link to={`/dashboard/documents/${verification.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-cyber-gray">No recent verifications found.</p>
          )}
        </CyberCard>
      </div>
      
      <CyberCard title="System Status">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <p className="text-green-400">All systems operational</p>
        </div>
        <div className="mt-4 text-sm text-cyber-gray">
          <p>Blockchain network: Active</p>
          <p>Verification service: Online</p>
          <p>Document storage: Secure</p>
        </div>
      </CyberCard>
    </div>
  );
};

export default Dashboard;
