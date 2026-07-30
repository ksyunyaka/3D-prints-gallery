import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import SupabaseSetupNotice from "@/components/SupabaseSetupNotice";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import PrintDetail from "./pages/PrintDetail";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPrintForm from "./pages/admin/PrintForm";

const queryClient = new QueryClient();

const App = () => {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/print/:slug" element={<PrintDetail />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="prints/new" element={<AdminPrintForm />} />
                <Route path="prints/:id" element={<AdminPrintForm />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
