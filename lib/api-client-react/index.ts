import { useQuery as useQueryRQ, useMutation as useMutationRQ, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export { QueryClient, QueryClientProvider };

export function useQuery<T>(options: any) {
  return useQueryRQ<T>(options);
}

export function useMutation(options: any) {
  return useMutationRQ(options);
}
