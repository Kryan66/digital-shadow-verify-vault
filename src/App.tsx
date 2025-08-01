
import { Toaster } from "@/components/ui/toaster";
import { SonnerToaster } from "@/frontend/components";
import { TooltipProvider } from "@/frontend/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/frontend/pages/Index";
import NotFound from "@/frontend/pages/NotFound";
import Login from "@/frontend/pages/auth/Login";
import Signup from "@/frontend/pages/auth/Signup";
import DashboardLayout from "@/frontend/layouts/DashboardLayout";
import Dashboard from "@/frontend/pages/dashboard/Dashboard";
import UploadDocument from "@/frontend/pages/dashboard/UploadDocument";
import Documents from "@/frontend/pages/dashboard/Documents";
import DocumentDetail from "@/frontend/pages/dashboard/DocumentDetail";
import VerificationHistory from "@/frontend/pages/dashboard/VerificationHistory";
import Profile from "@/frontend/pages/dashboard/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadDocument />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentDetail />} />
            <Route path="history" element={<VerificationHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
