import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeBet, claimWinnings } from '@/lib/qubic/contract';
import { BetDirection } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';

export function usePlaceBet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { address, balance } = useWallet();

  return useMutation({
    mutationFn: ({ direction, amount }: { direction: BetDirection; amount: number }) =>
      placeBet(direction, amount, address || undefined, balance),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['currentRound'] });
      toast({
        title: 'Bet Placed!',
        description: `Your ${data.bet.direction} bet of ${data.bet.amount} QVX has been placed`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Bet Failed',
        description: error instanceof Error ? error.message : 'Failed to place bet',
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
    mutationFn: (roundId: number) => claimWinnings(roundId, address || undefined),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userClaimable'] });
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      
      // Force refresh wallet context to update balance
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
