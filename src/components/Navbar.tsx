
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Don't show auth buttons on auth pages
  const showAuthButtons = !location.pathname.includes('/auth');

  return (
    <nav className="cyber-panel py-4 px-6 mb-6 bg-black/40 backdrop-blur-md z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold neon-text">Digital Shadow</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-4">
          {showAuthButtons && (
            <>
              <Link to="/auth/signup">
                <Button variant="default" className="cyber-button flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" className="border-cyber-purple/50 hover:border-cyber-purple/80 flex items-center gap-2">
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 cyber-panel md:hidden">
            <div className="flex flex-col space-y-4">
              {showAuthButtons && (
                <>
                  <Link to="/auth/signup" onClick={toggleMenu}>
                    <Button variant="default" className="cyber-button w-full flex items-center justify-center gap-2">
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                  <Link to="/auth/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full border-cyber-purple/50 hover:border-cyber-purple/80 flex items-center justify-center gap-2">
                      <LogIn size={16} />
                      <span>Login</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
