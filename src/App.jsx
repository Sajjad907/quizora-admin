import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import queryClient from "./lib/queryClient";
import Profile from "./features/dashboard/Profile";
import Dashboard from "./features/dashboard/Dashboard";
import QuizCreate from "./features/quiz/pages/QuizCreate";
import QuizBuilder from "./features/quiz/pages/QuizBuilder";
import LeadsPage from "./features/leads/pages/LeadsPage";
import { Toaster } from "react-hot-toast";
import QuizList from "./features/quiz/pages/QuizList";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ForgotPassword from "./features/auth/ForgotPassword";
import LandingPage from "./features/landing/pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AuthCheck = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return children;
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  // Detect if running inside Shopify
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get("shop");
  const host = urlParams.get("host");
  const isShopify = useMemo(() => !!(shop || host), [shop, host]);

  const appContent = (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 15, 15, 0.7)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 24px',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.02em',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            maxWidth: '450px',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthRedirect><LandingPage /></AuthRedirect>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/create" element={<QuizCreate />} />
            <Route path="/quiz/:id/builder" element={<QuizBuilder />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          {appContent}
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
