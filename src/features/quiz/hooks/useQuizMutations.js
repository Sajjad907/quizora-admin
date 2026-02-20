import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quizApi } from "../api/quizApi";

// Hook: Create a new Quiz
export const useCreateQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => quizApi.createQuiz(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["quiz-list"] });
        },
    });
};

// Hook: Update an existing Quiz (Save Builder Changes)
export const useUpdateQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => quizApi.updateQuiz(id, data),
        onSuccess: (updatedQuiz) => {
            // Update the specific quiz cache so we don't have to refetch everything
            queryClient.invalidateQueries({ queryKey: ["quiz", updatedQuiz._id] });
            queryClient.invalidateQueries({ queryKey: ["quiz-list"] });
            console.log("Quiz saved successfully!");
        }
    });
};

export const useDeleteQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => quizApi.deleteQuiz(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quiz-list"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        },
    });
};

