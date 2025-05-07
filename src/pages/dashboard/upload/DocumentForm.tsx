
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const uploadSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type",
  }),
  documentId: z.string().min(1, "Document ID is required"),
  issueDate: z.string().min(1, "Issue date is required"),
});

export type UploadFormValues = z.infer<typeof uploadSchema>;

interface DocumentFormProps {
  form: ReturnType<typeof useForm<UploadFormValues>>;
}

const DocumentForm = ({ form }: DocumentFormProps) => {
  return (
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
  );
};

export default DocumentForm;
