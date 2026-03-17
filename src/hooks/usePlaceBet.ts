import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataAdapter } from '@/services';
import { BetDirection } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';

export function usePlaceBet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { address, balance } = useWallet();

  return useMutation({
    mutationFn: ({ direction, amount }: { direction: BetDirection; amount: number }) =>
      dataAdapter.placeBet({
        direction,
        amount,
        walletAddress: address!,
        walletBalance: balance,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['currentRound'] });
      toast({
        title: 'Trade Placed',
        description: `Your ${data.bet.direction} trade of ${data.bet.amount} QVX has been entered`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Trade Failed',
        description: error instanceof Error ? error.message : 'Failed to place trade',
        variant: 'destructive',
      });
    },
  });
}

export function useClaimWinnings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { address } = useWallet();

  return useMutation({
    mutationFn: (roundId: number) => dataAdapter.claimWinnings(roundId, address!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userClaimable'] });
      queryClient.invalidateQueries({ queryKey: ['userBets'] });

      // Notify wallet context to refresh balance
      setTimeout(() => {
        window.dispatchEvent(new Event('wallet-balance-update'));
      }, 100);

      toast({
        title: 'Winnings Claimed!',
        description: `You received ${data.amount.toFixed(2)} QVX`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Claim Failed',
        description: error instanceof Error ? error.message : 'Failed to claim winnings',
        variant: 'destructive',
      });
    },
  });
}
