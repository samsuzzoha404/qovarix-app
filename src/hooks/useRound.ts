import { useQuery } from '@tanstack/react-query';
import { dataAdapter } from '@/services';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useCurrentRound() {
  return useQuery({
    queryKey: ['currentRound'],
    queryFn: () => dataAdapter.getCurrentRound(),
    refetchInterval: REFETCH_INTERVALS.tick,
    staleTime: 0,
  });
}

export function useRound(roundId: number) {
  return useQuery({
    queryKey: ['round', roundId],
    queryFn: () => dataAdapter.getRound(roundId),
    refetchInterval: REFETCH_INTERVALS.rounds,
  });
}
