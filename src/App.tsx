import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";

// Pages
import Login from "./pages/Login";
import DoctorDashboard from "./pages/doctor/Dashboard";
import OrderMedication from "./pages/doctor/OrderMedication";
import NurseSchedule from "./pages/nurse/Schedule";
import PharmacyOrders from "./pages/pharmacist/PharmacyOrders";
import Patients from "./pages/shared/Patients";
import Messages from "./pages/shared/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      
      {/* Doctor Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <OrderMedication />
          </ProtectedRoute>
        }
      />

      {/* Nurse Routes */}
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <NurseSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <NurseSchedule />
          </ProtectedRoute>
        }
      />

      {/* Pharmacist Routes */}
      <Route
        path="/pharmacy-orders"
        element={
          <ProtectedRoute>
            <PharmacyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/queue"
        element={
          <ProtectedRoute>
            <PharmacyOrders />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OfflineIndicator />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <InstallPrompt />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
