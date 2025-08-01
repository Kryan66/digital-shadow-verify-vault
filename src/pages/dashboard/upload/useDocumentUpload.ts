
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UploadFormValues } from "./DocumentForm";
import { useUpload } from "./UploadContext";
import { apiClient } from "@/lib/api";

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
      const response = await apiClient.uploadDocument(
        selectedFile,
        values.documentType,
        values.description
      );
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Document uploaded and verified successfully!");
        navigate("/dashboard/documents");
      }
    } catch (error) {
      toast.error("Failed to upload document. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpload,
    isLoading
  };
};
