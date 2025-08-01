
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface UploadContextType {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  handleFile: (file: File) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = (file: File) => {
    // For demo purposes, accept more file types
    if (!file.type.includes('pdf') && !file.type.includes('image/')) {
      toast.error("Only PDF and image files are allowed");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error("File size exceeds 10MB limit");
      return;
    }
    
    setSelectedFile(file);
    toast.success("File selected successfully!");
  };

  return (
    <UploadContext.Provider value={{ 
      selectedFile, 
      setSelectedFile, 
      isLoading, 
      setIsLoading, 
      handleFile 
    }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = (): UploadContextType => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUpload must be used within a UploadProvider");
  }
  return context;
};
