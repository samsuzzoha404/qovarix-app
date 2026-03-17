import { useQuery } from '@tanstack/react-query';
import { dataAdapter } from '@/services';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useCurrentPrice() {
  return useQuery({
    queryKey: ['currentPrice'],
    queryFn: () => dataAdapter.getCurrentPrice(),
    refetchInterval: REFETCH_INTERVALS.price,
    staleTime: 0,
  });
}
