// ─── Core Domain Types ────────────────────────────────────────────────────────
// These are the frontend's canonical data contracts.
// All adapters (mock, engine API, smart contract) must produce these shapes.
// ─────────────────────────────────────────────────────────────────────────────

export type BetDirection = 'UP' | 'DOWN';

export interface Round {
  id: number;
  startTick: number;
  endTick: number;
  startPrice: number;
  endPrice: number | null;
  result: BetDirection | null;
  totalPool: number;
  upPool: number;
  downPool: number;
  status: 'pending' | 'active' | 'completed' | 'resolved';
}

export interface Bet {
  id: string;
  roundId: number;
  address: string;
  direction: BetDirection;
  amount: number;
  timestamp: number;
  claimed: boolean;
  won: boolean | null;
  payout: number | null;
}

export interface Tick {
  tick: number;
  timestamp: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
}

export interface PriceData {
  price: number;
  change24h: number;
  timestamp: number;
}

export interface UserStats {
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  totalWagered: number;
  totalWon: number;
  winRate: number;
}

export interface ClaimableWinnings {
  roundId: number;
  amount: number;
  direction: BetDirection;
}

export interface PlaceBetRequest {
  direction: BetDirection;
  amount: number;
  walletAddress: string;
  walletBalance: number;
}

export interface PlaceBetResult {
  txHash: string;
  bet: Bet;
}

export interface ClaimResult {
  txHash: string;
  amount: number;
}

export interface AISignal {
  direction: BetDirection;
  confidence: number; // 0–1
  reasoning: string;
  timestamp: number;
}
