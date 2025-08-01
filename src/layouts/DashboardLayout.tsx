
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { FileText, Upload, History, LogOut, Menu, X, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Authentication check
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth/login");
      return;
    }
    
    const userData = JSON.parse(user);
    if (!userData.isLoggedIn) {
      navigate("/auth/login");
      return;
    }
    
    setIsLoggedIn(true);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (!isLoggedIn) {
    return null; // Don't render anything until authentication check completes
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile header */}
      <header className="md:hidden cyber-panel py-4 px-6 bg-black/40 backdrop-blur-md z-50 sticky top-0">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold neon-text">Digital Shadow</span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </header>
      
      <div className="flex flex-grow">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 cyber-panel bg-black/60 backdrop-blur-md h-screen sticky top-0">
          <div className="p-4">
            <Link to="/" className="flex items-center mb-6">
              <span className="text-xl font-bold neon-text">Digital Shadow</span>
            </Link>
            
            <nav className="space-y-1">
              <Link 
                to="/dashboard" 
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isLinkActive("/dashboard")
                    ? "bg-cyber-purple/20 text-white"
                    : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                }`}
              >
                <Shield size={18} className="mr-3" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/dashboard/upload" 
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isLinkActive("/dashboard/upload")
                    ? "bg-cyber-purple/20 text-white"
                    : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                }`}
              >
                <Upload size={18} className="mr-3" />
                <span>Upload Document</span>
              </Link>
              
              <Link 
                to="/dashboard/documents" 
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isLinkActive("/dashboard/documents")
                    ? "bg-cyber-purple/20 text-white"
                    : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                }`}
              >
                <FileText size={18} className="mr-3" />
                <span>My Documents</span>
              </Link>
              
              <Link 
                to="/dashboard/history" 
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isLinkActive("/dashboard/history")
                    ? "bg-cyber-purple/20 text-white"
                    : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                }`}
              >
                <History size={18} className="mr-3" />
                <span>Verification History</span>
              </Link>
              
              <Link 
                to="/dashboard/profile" 
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isLinkActive("/dashboard/profile")
                    ? "bg-cyber-purple/20 text-white"
                    : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                }`}
              >
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto p-4">
            <Separator className="my-4 bg-cyber-purple/20" />
            <Button 
              variant="ghost" 
              className="w-full justify-start text-cyber-gray hover:text-white hover:bg-red-900/20" 
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </aside>
        
        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/80 z-40 md:hidden">
            <div className="cyber-panel bg-black/90 backdrop-blur-md w-64 h-full">
              <div className="p-4">
                <nav className="space-y-1 mt-6">
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isLinkActive("/dashboard")
                        ? "bg-cyber-purple/20 text-white"
                        : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield size={18} className="mr-3" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link 
                    to="/dashboard/upload" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isLinkActive("/dashboard/upload")
                        ? "bg-cyber-purple/20 text-white"
                        : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Upload size={18} className="mr-3" />
                    <span>Upload Document</span>
                  </Link>
                  
                  <Link 
                    to="/dashboard/documents" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isLinkActive("/dashboard/documents")
                        ? "bg-cyber-purple/20 text-white"
                        : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText size={18} className="mr-3" />
                    <span>My Documents</span>
                  </Link>
                  
                  <Link 
                    to="/dashboard/history" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isLinkActive("/dashboard/history")
                        ? "bg-cyber-purple/20 text-white"
                        : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <History size={18} className="mr-3" />
                    <span>Verification History</span>
                  </Link>
                  
                  <Link 
                    to="/dashboard/profile" 
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isLinkActive("/dashboard/profile")
                        ? "bg-cyber-purple/20 text-white"
                        : "text-cyber-gray hover:bg-cyber-purple/10 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} className="mr-3" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </div>
              
              <div className="mt-auto p-4">
                <Separator className="my-4 bg-cyber-purple/20" />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-cyber-gray hover:text-white hover:bg-red-900/20" 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
            
            <div 
              className="absolute top-0 right-0 p-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button variant="ghost" size="icon">
                <X size={24} />
              </Button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-grow p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
