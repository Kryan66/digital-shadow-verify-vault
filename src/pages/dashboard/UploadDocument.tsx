
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CyberCard from "@/components/CyberCard";
import { Upload, FileText, Loader2, AlertTriangle } from "lucide-react";

const uploadSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type",
  }),
  documentId: z.string().min(1, "Document ID is required"),
  issueDate: z.string().min(1, "Issue date is required"),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const UploadDocument = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      documentType: "",
      documentId: "",
      issueDate: "",
    },
  });
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
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
  
  const onSubmit = async (values: UploadFormValues) => {
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
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
      <p className="text-cyber-gray mb-6">
        Upload your documents for blockchain verification and secure storage
      </p>
      
      <CyberCard>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black/90 border-cyber-purple/50">
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="voter">Voter ID</SelectItem>
                        <SelectItem value="birth">Birth Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="documentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter document ID"
                        className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive 
                  ? "border-cyber-purple bg-cyber-purple/10" 
                  : "border-cyber-purple/30 hover:border-cyber-purple/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-full bg-cyber-purple/20 text-cyber-purple mx-auto w-fit">
                      <FileText size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-medium truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-cyber-gray">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-cyber-purple/50"
                      onClick={() => setSelectedFile(null)}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-cyber-purple/20 text-cyber-purple mb-4">
                      <Upload size={32} />
                    </div>
                    <p className="text-lg mb-2">Drag & drop your document here</p>
                    <p className="text-sm text-cyber-gray mb-4">
                      PDF and image files are allowed (Max 10MB)
                    </p>
                    <label htmlFor="file-upload">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="border-cyber-purple/50"
                      >
                        Select File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-md p-4 flex items-start">
              <AlertTriangle size={20} className="text-cyber-blue shrink-0 mr-3 mt-0.5" />
              <div className="text-sm">
                <p className="text-cyber-blue font-medium mb-1">Important Note</p>
                <p className="text-cyber-gray">
                  By uploading your document, you confirm that you have the right to use it and that it doesn't violate any privacy laws. 
                  Your document will be securely stored and verified using blockchain technology.
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="cyber-button w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading and Verifying...
                </>
              ) : (
                "Upload & Verify Document"
              )}
            </Button>
          </form>
        </Form>
      </CyberCard>
    </div>
  );
};

export default UploadDocument;
