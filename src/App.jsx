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
  if (loading) return null; // Or a subtle splash screen
  return children;
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Toaster position="bottom-right" />
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
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
