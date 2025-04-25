import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { ToastProvider } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "./components/error/ErrorBoundary";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import News from "./pages/News";
import Profile from "./pages/Profile";
import Subscriptions from "./pages/Subscriptions";
import VolleyballWorkouts from "./pages/VolleyballWorkouts";
import Milestones from "./pages/Milestones";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import WorkoutProvider from "./contexts/WorkoutContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/update-password" element={<PasswordReset />} />
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="/volleyball-workouts" element={
                <ProtectedRoute>
                  <VolleyballWorkouts />
                </ProtectedRoute>
              } />
              <Route path="/news" element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/milestones" element={
                <ProtectedRoute>
                  <Milestones />
                </ProtectedRoute>
              } />
              <Route path="/subscriptions" element={
                <ProtectedRoute>
                  <Subscriptions />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <WorkoutProvider>
                <BrowserRouter>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <div className="min-h-screen pb-16 sm:pb-0 sm:pt-16 bg-muted transition-colors duration-300">
                      <AppRoutes />
                    </div>
                  </TooltipProvider>
                </BrowserRouter>
              </WorkoutProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
