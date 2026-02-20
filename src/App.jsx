import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppContext";
import queryClient from "./lib/queryClient";
import Dashboard from "./features/dashboard/Dashboard";
import QuizCreate from "./features/quiz/pages/QuizCreate";
import QuizBuilder from "./features/quiz/pages/QuizBuilder";
import LeadsPage from "./features/leads/pages/LeadsPage";
import { Toaster } from "react-hot-toast";
import QuizList from "./features/quiz/pages/QuizList";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Toaster position="bottom-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/create" element={<QuizCreate />} />
            <Route path="/quiz/:id/builder" element={<QuizBuilder />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
