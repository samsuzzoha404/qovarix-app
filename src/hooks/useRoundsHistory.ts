import { useQuery } from '@tanstack/react-query';
import { dataAdapter } from '@/services';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useRoundsHistory(limit = 20) {
  return useQuery({
    queryKey: ['roundsHistory', limit],
    queryFn: () => dataAdapter.getRoundsHistory(limit),
    refetchInterval: REFETCH_INTERVALS.rounds,
  });
}
