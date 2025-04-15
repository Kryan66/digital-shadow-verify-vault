
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="cyber-panel py-6 px-6 mt-auto bg-black/40 backdrop-blur-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-cyber-gray">
            © {new Date().getFullYear()} Digital Shadow. All rights reserved.
          </p>
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className="text-cyber-gray hover:text-cyber-purple transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="text-cyber-gray hover:text-cyber-purple transition-colors">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
