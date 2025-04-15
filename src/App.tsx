
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import UploadDocument from "./pages/dashboard/UploadDocument";
import Documents from "./pages/dashboard/Documents";
import DocumentDetail from "./pages/dashboard/DocumentDetail";
import VerificationHistory from "./pages/dashboard/VerificationHistory";
import Profile from "./pages/dashboard/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
