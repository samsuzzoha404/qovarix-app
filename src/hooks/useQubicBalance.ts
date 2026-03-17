import { useQuery } from '@tanstack/react-query';
import { qubicConnector } from '@/lib/qubic/connector';
import { useWalletContext } from '@/hooks/useWalletContext';
import { REFETCH_INTERVALS } from '@/config/constants';

export function useQubicBalance() {
  const { connected, address, isDemoMode, balance } = useWalletContext();

  return useQuery({
    queryKey: ['qubicBalance', address, isDemoMode],
    queryFn: async (): Promise<number> => {
      if (!connected || !address) return 0;
      // In demo mode, return the balance from context — no RPC polling needed
      if (isDemoMode) return balance;
      return qubicConnector.getBalance(address);
    },
    enabled: connected && !!address,
    refetchInterval: isDemoMode ? false : REFETCH_INTERVALS.balance,
    staleTime: 1000,
    retry: 2,
    retryDelay: 1000,
  });
}
