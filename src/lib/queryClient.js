import { QueryClient } from '@tanstack/react-query';

// Central Query Client configuration
// Optimize for better UX by avoiding aggressive refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Prevent refetching when user switches tabs (good for forms)
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Unused data is garbage collected after 30 minutes
    },
    mutations: {
      retry: 0, // Don't retry mutations (like POST/PUT) automatically
    },
  },
});

export default queryClient;
