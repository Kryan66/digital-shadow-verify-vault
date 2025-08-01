
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { useUpload } from "./UploadContext";

const FileUploadZone = () => {
  const { selectedFile, handleFile } = useUpload();
  const [dragActive, setDragActive] = useState(false);

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

  return (
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
              onClick={() => handleFile(null as unknown as File)}
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
  );
};

export default FileUploadZone;
