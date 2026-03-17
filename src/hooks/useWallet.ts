import { useCallback } from 'react';
import { useWalletContext } from '@/hooks/useWalletContext';
import { useToast } from '@/hooks/use-toast';
import { useQubicBalance } from '@/hooks/useQubicBalance';

export function useWallet() {
  const walletContext = useWalletContext();
  const { toast } = useToast();
  const { data: liveBalance } = useQubicBalance();

  const connect = useCallback(async () => {
    try {
      await walletContext.connectWallet();
      toast({
        title: 'Live Wallet Coming Soon',
        description: 'Live wallet integration is coming in live integration. Use Demo Wallet for now.',
      });
    } catch (error) {
      toast({
        title: 'Live Wallet Unavailable',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  }, [walletContext, toast]);

  const connectDemoWallet = useCallback(async () => {
    await walletContext.connectDemoWallet();
  }, [walletContext]);

  const disconnect = useCallback(() => {
    walletContext.disconnectWallet();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [walletContext, toast]);

  // Use live balance from TanStack Query if available, otherwise use context balance
  const rawBalance = liveBalance ?? walletContext.balance;
  // Ensure balance is always a valid number
  const balance = !isNaN(rawBalance) && isFinite(rawBalance) ? rawBalance : 0;

  return {
    connected: walletContext.connected,
    address: walletContext.address,
    balance,
    isConnecting: walletContext.isConnecting,
    error: walletContext.error,
    connect,
    connectDemoWallet,
    disconnect,
    disconnectWallet: walletContext.disconnectWallet,
    signAndSendTx: walletContext.signAndSendTx,
    refreshBalance: walletContext.refreshBalance,
    isDemoMode: walletContext.isDemoMode,
  };
}
