// ─── Centralized App Config ───────────────────────────────────────────────────
// Single source of truth for all environment-facing and app-wide config values.
// Import from here instead of scattering constants across components.
//
// Relationship with existing config files:
//   - product.ts  → product identity, copy, mode metadata (unchanged)
//   - constants.ts → QUBIC_CONFIG, REFETCH_INTERVALS, ROUTES (unchanged, still used)
//   - app.ts (this file) → integration-readiness config: assets, links, explorer,
//     adapter selection, and values that will differ per environment/mode
// ─────────────────────────────────────────────────────────────────────────────

import { AppMode, CURRENT_APP_MODE } from './product';

// ── Supported Assets ──────────────────────────────────────────────────────────

export interface AssetConfig {
  id: string;
  label: string;
  description: string;
}

export const SUPPORTED_ASSETS: AssetConfig[] = [
  {
    id: 'QVX/USD',
    label: 'QVX / USD',
    description: 'Qovarix ecosystem token vs US Dollar',
  },
];

export const DEFAULT_ASSET_ID = SUPPORTED_ASSETS[0].id;

// ── Trading Parameters ────────────────────────────────────────────────────────

export const TRADING_CONFIG = {
  minBet: 1,
  maxBet: 10_000,
  houseFee: 0.02,        // 2%
  roundDuration: 30,     // ticks per round
  tickDuration: 1_000,   // ms per tick
  payoutMultiplier: 1.9, // approximate win payout (pool-based in live mode)
} as const;

// ── Network / Explorer ────────────────────────────────────────────────────────

export const NETWORK_CONFIG: Record<AppMode, {
  label: string;
  explorerBaseUrl: string | null;
  chainId: number | null;
}> = {
  [AppMode.Demo]: {
    label: 'Demo',
    explorerBaseUrl: null,
    chainId: null,
  },
  [AppMode.Testnet]: {
    label: 'Base Sepolia',
    explorerBaseUrl: 'https://sepolia.basescan.org',
    chainId: 84532,
  },
  [AppMode.Live]: {
    label: 'Base Mainnet',
    explorerBaseUrl: 'https://basescan.org',
    chainId: 8453,
  },
};

export const CURRENT_NETWORK = NETWORK_CONFIG[CURRENT_APP_MODE];

// ── External Links ────────────────────────────────────────────────────────────

export const EXTERNAL_LINKS = {
  docs: null as string | null,          // null = not yet available
  support: null as string | null,       // null = not yet available
  baseChain: 'https://base.org',
  twitter: null as string | null,
  discord: null as string | null,
} as const;

// ── Demo Wallet ───────────────────────────────────────────────────────────────

export const DEMO_WALLET = {
  address: 'DEMOCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCAAAAA',
  initialBalance: 10_000,
} as const;

// ── localStorage Keys ─────────────────────────────────────────────────────────
// Centralised so all storage access uses the same keys.

export const STORAGE_KEYS = {
  walletConnected: 'qubic_wallet_connected',
  demoWallet: 'qubic_demo_wallet',
  demoBalance: 'qubic_demo_balance',
  demoPrice: 'qubic_demo_price',
  demoPriceHistory: 'qubic_demo_price_history',
  demoBets: 'qubic_demo_bets',
  demoRoundPrices: 'qubic_demo_round_prices',
  theme: 'theme',
} as const;

// ── Adapter Selection ─────────────────────────────────────────────────────────
// Controls which IDataAdapter implementation is active.
// Change this (or derive it from CURRENT_APP_MODE) to switch data backends.

export type AdapterType = 'mock' | 'engineApi' | 'smartContract';

export const ACTIVE_ADAPTER: AdapterType = 'mock';
