import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Database, FileCheck, History } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-cyber-black/90 via-cyber-purple/10 to-cyber-black/90 animate-gradient-shift">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple-400 to-cyber-purple-600 animate-pulse-color">
              Digital Shadow
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-cyber-purple-200">
              Blockchain-powered document verification system for the digital age
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth/signup" className="group">
                <Button className="cyber-button text-lg py-6 px-8 group-hover:bg-cyber-purple-500 transition-colors duration-300">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth/login" className="group">
                <Button 
                  variant="outline" 
                  className="border-cyber-purple/50 hover:border-cyber-purple-600 text-cyber-purple-300 hover:text-cyber-purple-100 text-lg py-6 px-8 transition-all duration-300 group-hover:scale-105"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-cyber-purple-400">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CyberCard className="h-full hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-cyber-purple/20 text-cyber-purple-500">
                  <FileCheck size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyber-purple-300">Upload Documents</h3>
                <p className="text-cyber-purple-200">
                  Upload your ID documents in PDF format including PAN Card, Aadhar Card, Voting Card, and Birth Certificate.
                </p>
              </div>
            </CyberCard>
            
            <CyberCard className="h-full hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-cyber-purple/20 text-cyber-purple-500">
                  <Database size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyber-purple-300">Blockchain Processing</h3>
                <p className="text-cyber-purple-200">
                  Our system processes documents using secure blockchain technology to create immutable verification records.
                </p>
              </div>
            </CyberCard>
            
            <CyberCard className="h-full hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-cyber-purple/20 text-cyber-purple-500">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyber-purple-300">Verification</h3>
                <p className="text-cyber-purple-200">
                  Get instant verification results confirming whether documents are authentic or have been tampered with.
                </p>
              </div>
            </CyberCard>
            
            <CyberCard className="h-full hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-cyber-purple/20 text-cyber-purple-500">
                  <History size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyber-purple-300">Verification History</h3>
                <p className="text-cyber-purple-200">
                  Access your complete document verification history at any time with our secure storage system.
                </p>
              </div>
            </CyberCard>
          </div>
        </section>
        
        <section className="mb-16">
          <CyberCard>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-cyber-purple-400">Why Choose Digital Shadow?</h2>
              <p className="text-lg text-cyber-purple-200 mb-8 max-w-3xl mx-auto">
                Our blockchain-based verification system provides unmatched security and reliability for your important documents.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-cyber-blue">Secure & Tamper-Proof</h3>
                  <p className="text-cyber-purple-200">
                    Blockchain technology ensures that verification results cannot be altered or falsified.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-cyber-blue">Instant Verification</h3>
                  <p className="text-cyber-purple-200">
                    Get real-time results on document authenticity without lengthy waiting periods.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-cyber-blue">Privacy Focused</h3>
                  <p className="text-cyber-purple-200">
                    Your documents are securely handled with advanced encryption and privacy controls.
                  </p>
                </div>
              </div>
            </div>
          </CyberCard>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
