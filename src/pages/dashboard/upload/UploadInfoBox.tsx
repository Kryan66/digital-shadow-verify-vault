
import { AlertTriangle } from "lucide-react";

const UploadInfoBox = () => {
  return (
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
  );
};

export default UploadInfoBox;
