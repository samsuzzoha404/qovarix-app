import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { qubicConnector, QubicConnector, TransactionResult, ContractTxParams } from '@/lib/qubic/connector';
import { WalletState } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';

const STORAGE_KEY = 'qubic_wallet_connected';
const DEMO_WALLET_KEY = 'qubic_demo_wallet';
const DEMO_BALANCE_KEY = 'qubic_demo_balance';

// Demo wallet configuration
const DEMO_ADDRESS = 'DEMOCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCAAAAA';
const INITIAL_DEMO_BALANCE = 10000;

export interface WalletContextValue extends WalletState {
  isConnecting: boolean;
  error: string | null;
  connectWallet: (seed: string) => Promise<void>;
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
    const savedBalance = localStorage.getItem(DEMO_BALANCE_KEY);
    if (savedBalance) {
      const parsed = parseFloat(savedBalance);
      if (isNaN(parsed) || !isFinite(parsed)) {
        console.warn('Corrupted balance detected, resetting to initial balance');
        localStorage.setItem(DEMO_BALANCE_KEY, INITIAL_DEMO_BALANCE.toString());
      }
    }
  }, []);

  const connectWalletInternal = useCallback(async (seed: string): Promise<void> => {
    if (!QubicConnector.isValidSeed(seed)) {
      throw new Error('Invalid seed: must be at least 55 characters');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const walletInfo = await qubicConnector.connect(seed);
      const balance = await qubicConnector.getBalance();

      setState({
        connected: true,
        address: walletInfo.address,
        balance,
      });

      setIsDemoMode(false); // Clear demo mode for real wallet
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.removeItem(DEMO_WALLET_KEY); // Ensure demo flag is cleared
      // Note: seed is NOT persisted to any storage for security
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
      // Load saved demo balance or use initial
      const savedBalance = localStorage.getItem(DEMO_BALANCE_KEY);
      let balance = INITIAL_DEMO_BALANCE;
      
      if (savedBalance) {
        const parsed = parseFloat(savedBalance);
        balance = !isNaN(parsed) && isFinite(parsed) ? parsed : INITIAL_DEMO_BALANCE;
      }

      setState({
        connected: true,
        address: DEMO_ADDRESS,
        balance,
      });

      setIsDemoMode(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(DEMO_WALLET_KEY, 'true');
      localStorage.setItem(DEMO_BALANCE_KEY, balance.toString());
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

    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    const isDemoWallet = localStorage.getItem(DEMO_WALLET_KEY) === 'true';

    if (wasConnected && isDemoWallet) {
      connectDemoWalletInternal().catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(DEMO_WALLET_KEY);
      });
    } else if (wasConnected && !isDemoWallet) {
      // Real wallet sessions cannot be auto-reconnected (seed is not persisted).
      // Clear stale connection flag so the user is prompted to reconnect.
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [connectWalletInternal, connectDemoWalletInternal]);

  const connectWallet = useCallback(async (seed: string): Promise<void> => {
    await connectWalletInternal(seed);
  }, [connectWalletInternal]);

  const connectDemoWallet = useCallback(async (): Promise<void> => {
    await connectDemoWalletInternal();
  }, [connectDemoWalletInternal]);

  const disconnectWallet = useCallback((): void => {
    qubicConnector.disconnect();
    
    setState({
      connected: false,
      address: null,
      balance: 0,
    });

    setIsDemoMode(false);
    // Clear persisted state
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DEMO_WALLET_KEY);
    setError(null);
  }, []);

  const getAddress = useCallback((): string | null => {
    if (isDemoMode) {
      return DEMO_ADDRESS;
    }
    return qubicConnector.getAddress();
  }, [isDemoMode]);

  const getBalance = useCallback(async (): Promise<number> => {
    if (isDemoMode) {
      return state.balance;
    }
    
    if (!qubicConnector.isConnected()) {
      return 0;
    }

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
      const savedBalance = localStorage.getItem(DEMO_BALANCE_KEY);
      if (savedBalance) {
        const parsed = parseFloat(savedBalance);
        const balance = !isNaN(parsed) && isFinite(parsed) ? parsed : INITIAL_DEMO_BALANCE;
        setState(prev => ({ ...prev, balance }));
        // Save corrected balance if it was invalid
        if (isNaN(parsed) || !isFinite(parsed)) {
          localStorage.setItem(DEMO_BALANCE_KEY, balance.toString());
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
      if (state.connected) {
        refreshBalance();
      }
    };

    window.addEventListener('wallet-balance-update', handleBalanceUpdate);
    return () => {
      window.removeEventListener('wallet-balance-update', handleBalanceUpdate);
    };
  }, [state.connected, refreshBalance]);

  const signAndSendTx = useCallback(async (params: ContractTxParams): Promise<TransactionResult> => {
    if (isDemoMode) {
      // Simulate transaction in demo mode
      // Note: Balance is deducted in the contract.placeBet function
      // This is just a placeholder for transaction simulation
      return {
        txHash: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        success: true,
        message: 'Demo transaction successful',
      };
    }
    
    if (!qubicConnector.isConnected()) {
      return {
        txHash: '',
        success: false,
        message: 'Wallet not connected',
      };
    }

    try {
      const result = await qubicConnector.signAndSendTx(params);
      
      // Refresh balance after transaction
      if (result.success) {
        await refreshBalance();
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      return {
        txHash: '',
        success: false,
        message,
      };
    }
  }, [isDemoMode, state.balance, refreshBalance]);

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

// Export context for useWalletContext hook only
export { WalletContext };
export type { ContractTxParams, TransactionResult };
