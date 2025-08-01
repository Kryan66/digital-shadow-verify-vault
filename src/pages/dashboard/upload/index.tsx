
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CyberCard from "@/components/CyberCard";
import { UploadProvider, useUpload } from "./UploadContext";
import FileUploadZone from "./FileUploadZone";
import DocumentForm, { uploadSchema, UploadFormValues } from "./DocumentForm";
import UploadInfoBox from "./UploadInfoBox";
import { useDocumentUpload } from "./useDocumentUpload";

const UploadDocumentForm = () => {
  const { selectedFile } = useUpload();
  const { handleUpload, isLoading } = useDocumentUpload();
  
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      documentType: "",
      documentId: "",
      issueDate: "",
    },
  });
  
  const onSubmit = (values: UploadFormValues) => {
    handleUpload(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DocumentForm form={form} />
        <FileUploadZone />
        <UploadInfoBox />
        <Button 
          type="submit" 
          className="cyber-button w-full"
          disabled={isLoading || !selectedFile}
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
  );
};

const UploadDocument = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
      <p className="text-cyber-gray mb-6">
        Upload your documents for blockchain verification and secure storage
      </p>
      
      <CyberCard>
        <UploadProvider>
          <UploadDocumentForm />
        </UploadProvider>
      </CyberCard>
    </div>
  );
};

export default UploadDocument;
