import { createContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { qubicConnector, TransactionResult, ContractTxParams } from '@/lib/qubic/connector';
import { WalletState } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';
import { DEMO_WALLET, STORAGE_KEYS } from '@/config/app';

export interface WalletContextValue extends WalletState {
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  connectDemoWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getAddress: () => string | null;
  getBalance: () => Promise<number>;
  signAndSendTx: (params: ContractTxParams) => Promise<TransactionResult>;
  refreshBalance: () => Promise<void>;
  isDemoMode: boolean;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const hasAutoConnected = useRef(false);

  // Clean up any corrupted localStorage data on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem(STORAGE_KEYS.demoBalance);
    if (savedBalance) {
      const parsed = parseFloat(savedBalance);
      if (isNaN(parsed) || !isFinite(parsed)) {
        localStorage.setItem(STORAGE_KEYS.demoBalance, DEMO_WALLET.initialBalance.toString());
      }
    }
  }, []);

  const connectWalletInternal = useCallback(async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);
    try {
      throw new Error('Live wallet integration is coming in live integration. Use Demo Wallet for now.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw new Error(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectDemoWalletInternal = useCallback(async (): Promise<void> => {
    if (!QUBIC_CONFIG.simulationMode) {
      throw new Error('Demo wallet only available in simulation mode');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.demoBalance);
      let balance = DEMO_WALLET.initialBalance;
      if (savedBalance) {
        const parsed = parseFloat(savedBalance);
        balance = !isNaN(parsed) && isFinite(parsed) ? parsed : DEMO_WALLET.initialBalance;
      }

      setState({ connected: true, address: DEMO_WALLET.address, balance });
      setIsDemoMode(true);
      localStorage.setItem(STORAGE_KEYS.walletConnected, 'true');
      localStorage.setItem(STORAGE_KEYS.demoWallet, 'true');
      localStorage.setItem(STORAGE_KEYS.demoBalance, balance.toString());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect demo wallet';
      setError(message);
      throw new Error(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Auto-reconnect on mount if previously connected
  useEffect(() => {
    if (hasAutoConnected.current) return;
    hasAutoConnected.current = true;

    const wasConnected = localStorage.getItem(STORAGE_KEYS.walletConnected) === 'true';
    const isDemoWallet = localStorage.getItem(STORAGE_KEYS.demoWallet) === 'true';

    if (wasConnected && isDemoWallet) {
      connectDemoWalletInternal().catch(() => {
        localStorage.removeItem(STORAGE_KEYS.walletConnected);
        localStorage.removeItem(STORAGE_KEYS.demoWallet);
      });
    } else if (wasConnected) {
      localStorage.removeItem(STORAGE_KEYS.walletConnected);
    }
  }, [connectWalletInternal, connectDemoWalletInternal]);

  const connectWallet = useCallback(async (): Promise<void> => {
    await connectWalletInternal();
  }, [connectWalletInternal]);

  const connectDemoWallet = useCallback(async (): Promise<void> => {
    await connectDemoWalletInternal();
  }, [connectDemoWalletInternal]);

  const disconnectWallet = useCallback((): void => {
    qubicConnector.disconnect();
    setState({ connected: false, address: null, balance: 0 });
    setIsDemoMode(false);
    localStorage.removeItem(STORAGE_KEYS.walletConnected);
    localStorage.removeItem(STORAGE_KEYS.demoWallet);
    setError(null);
  }, []);

  const getAddress = useCallback((): string | null => {
    if (isDemoMode) return DEMO_WALLET.address;
    return qubicConnector.getAddress();
  }, [isDemoMode]);

  const getBalance = useCallback(async (): Promise<number> => {
    if (isDemoMode) return state.balance;

    if (!qubicConnector.isConnected()) return 0;

    try {
      const balance = await qubicConnector.getBalance();
      setState(prev => ({ ...prev, balance }));
      return balance;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(message);
      return state.balance;
    }
  }, [isDemoMode, state.balance]);

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (isDemoMode) {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.demoBalance);
      if (savedBalance) {
        const parsed = parseFloat(savedBalance);
        const balance = !isNaN(parsed) && isFinite(parsed) ? parsed : DEMO_WALLET.initialBalance;
        setState(prev => ({ ...prev, balance }));
        if (isNaN(parsed) || !isFinite(parsed)) {
          localStorage.setItem(STORAGE_KEYS.demoBalance, balance.toString());
        }
      }
    } else if (qubicConnector.isConnected()) {
      try {
        const balance = await qubicConnector.getBalance();
        setState(prev => ({ ...prev, balance }));
      } catch (err) {
        console.error('Failed to refresh balance:', err);
      }
    }
  }, [isDemoMode]);

  // Listen for balance update events (e.g., after claiming winnings)
  useEffect(() => {
    const handleBalanceUpdate = () => {
      if (state.connected) refreshBalance();
    };
    window.addEventListener('wallet-balance-update', handleBalanceUpdate);
    return () => window.removeEventListener('wallet-balance-update', handleBalanceUpdate);
  }, [state.connected, refreshBalance]);

  const signAndSendTx = useCallback(async (params: ContractTxParams): Promise<TransactionResult> => {
    if (isDemoMode) {
      return {
        txHash: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        success: true,
        message: 'Demo transaction successful',
      };
    }

    if (!qubicConnector.isConnected()) {
      return { txHash: '', success: false, message: 'Wallet not connected' };
    }

    try {
      const result = await qubicConnector.signAndSendTx(params);
      if (result.success) await refreshBalance();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      return { txHash: '', success: false, message };
    }
  }, [isDemoMode, refreshBalance]);

  const value: WalletContextValue = {
    ...state,
    isConnecting,
    error,
    connectWallet,
    connectDemoWallet,
    disconnectWallet,
    getAddress,
    getBalance,
    signAndSendTx,
    refreshBalance,
    isDemoMode,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export { WalletContext };
export type { ContractTxParams, TransactionResult };
