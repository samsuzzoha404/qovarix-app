import { useQuery } from '@tanstack/react-query';
import { dataAdapter } from '@/services';

export function useAISignal() {
  return useQuery({
    queryKey: ['aiSignal'],
    queryFn: () => dataAdapter.getAISignal(),
    refetchInterval: 5000,
    staleTime: 4000,
  });
}
