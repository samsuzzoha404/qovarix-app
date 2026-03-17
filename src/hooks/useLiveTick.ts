import { useQuery } from '@tanstack/react-query';
import { dataAdapter } from '@/services';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useLiveTick() {
  return useQuery({
    queryKey: ['liveTick'],
    queryFn: () => dataAdapter.getLiveTick(),
    refetchInterval: REFETCH_INTERVALS.tick,
    staleTime: 0,
  });
}
