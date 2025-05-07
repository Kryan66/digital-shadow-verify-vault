
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UploadFormValues } from "./DocumentForm";
import { useUpload } from "./UploadContext";

export const useDocumentUpload = () => {
  const navigate = useNavigate();
  const { selectedFile, isLoading, setIsLoading } = useUpload();
  
  const handleUpload = async (values: UploadFormValues) => {
    if (!selectedFile) {
      toast.error("Please upload a document");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create form data for file upload (useful for real API integration)
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', values.documentType);
      formData.append('documentId', values.documentId);
      formData.append('issueDate', values.issueDate);
      
      console.log("Upload form data:", Object.fromEntries(formData.entries()));
      
      // Simulate API call for document upload and blockchain verification
      setTimeout(() => {
        console.log("Upload values:", values);
        console.log("File:", selectedFile);
        
        // Mock document data to be stored
        const documentData = {
          id: `doc-${Date.now()}`,
          type: values.documentType,
          documentId: values.documentId,
          issueDate: values.issueDate,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          uploadDate: new Date().toISOString(),
          status: "pending",
        };
        
        // Store in local storage for demo purposes
        const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
        localStorage.setItem("documents", JSON.stringify([...existingDocs, documentData]));
        
        setIsLoading(false);
        toast.success("Document uploaded and sent for verification!");
        
        // Navigate after a brief delay to ensure toast is seen
        setTimeout(() => {
          navigate("/dashboard/documents");
        }, 1000);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to upload document. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return {
    handleUpload,
    isLoading
  };
};
