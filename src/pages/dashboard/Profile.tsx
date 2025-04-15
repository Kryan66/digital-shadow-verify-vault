
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CyberCard from "@/components/CyberCard";
import { Loader2, User, Shield, Key, Lock } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const fetchUserData = () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        
        profileForm.reset({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
        });
      }
      
      setIsLoading(false);
    };
    
    setTimeout(fetchUserData, 500);
  }, [profileForm]);
  
  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile update values:", values);
      
      // Update user data in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          name: values.name,
          email: values.email,
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
      
      setIsUpdatingProfile(false);
      toast.success("Profile updated successfully!");
    }, 1500);
  };
  
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsUpdatingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Password update values:", values);
      
      setIsUpdatingPassword(false);
      toast.success("Password updated successfully!");
      
      // Reset password form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
      <p className="text-cyber-gray mb-6">
        Manage your account information and security settings
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CyberCard>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-cyber-purple/20 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-cyber-purple" />
            </div>
            <h2 className="text-xl font-bold">{userData.name || "User"}</h2>
            <p className="text-cyber-gray">{userData.email || "user@example.com"}</p>
            
            <div className="mt-4 p-2 bg-cyber-purple/10 rounded-md text-xs text-center w-full">
              <p className="text-cyber-blue font-medium">Account active since</p>
              <p>April 15, 2024</p>
            </div>
          </div>
        </CyberCard>
        
        <div className="md:col-span-2">
          <CyberCard title="Account Information">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="cyber-button"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CyberCard>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CyberCard title="Change Password">
          <div className="mb-4 flex items-center text-cyber-gray">
            <Lock size={16} className="mr-2" />
            <span className="text-sm">Update your password regularly for better security</span>
          </div>
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-black/30 border-cyber-purple/30 focus:border-cyber-purple/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="cyber-button"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </CyberCard>
        
        <CyberCard title="Security Settings">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/20 rounded">
              <div className="flex items-center">
                <Shield size={18} className="text-cyber-purple mr-3" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-cyber-gray">Enhance your account security</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-cyber-purple/50">
                Enable
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-black/20 rounded">
              <div className="flex items-center">
                <Key size={18} className="text-cyber-purple mr-3" />
                <div>
                  <p className="font-medium">API Access Keys</p>
                  <p className="text-sm text-cyber-gray">Manage API keys for developers</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-cyber-purple/50">
                Manage
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-black/20 rounded">
              <div className="flex items-center">
                <Lock size={18} className="text-cyber-purple mr-3" />
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-cyber-gray">View and manage active logins</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-cyber-purple/50">
                View
              </Button>
            </div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default Profile;
