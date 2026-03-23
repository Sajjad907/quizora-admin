import { useQuery } from "@tanstack/react-query";
import { quizApi } from "../api/quizApi";

// Hook: Fetch all quizzes
export const useQuizzes = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["quiz-list", page, limit], 
    queryFn: () => quizApi.getQuizzes({ page, limit }),
    keepPreviousData: true, 
  });
};

// Hook: Fetch single quiz
export const useQuiz = (id) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizApi.getQuizById(id),
    enabled: !!id, // Only run if ID exists
  });
};

// Hook: Fetch global stats
export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => quizApi.getStats(),
  });
};
