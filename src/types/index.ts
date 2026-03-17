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

export interface ClaimableWinnings {
  roundId: number;
  amount: number;
  direction: BetDirection;
}
