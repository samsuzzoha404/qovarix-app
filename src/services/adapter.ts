// ─── IDataAdapter ─────────────────────────────────────────────────────────────
// The frontend's data contract. Every data backend (mock, engine API, smart
// contract) must implement this interface. UI components and hooks only depend
// on this interface — never on a concrete adapter directly.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Tick,
  PriceData,
  Round,
  Bet,
  ClaimableWinnings,
  PlaceBetRequest,
  PlaceBetResult,
  ClaimResult,
  AISignal,
} from '@/types';

export interface IDataAdapter {
  // ── Market / Price ──────────────────────────────────────────────────────────
  /** Get the current live tick (block/sequence number). */
  getLiveTick(): Promise<Tick>;

  /** Get the current asset price and 24h change. */
  getCurrentPrice(): Promise<PriceData>;

  // ── Rounds ──────────────────────────────────────────────────────────────────
  /** Get the currently active round. */
  getCurrentRound(): Promise<Round>;

  /** Get a specific round by ID. */
  getRound(id: number): Promise<Round>;

  /** Get a list of past rounds, most recent first. */
  getRoundsHistory(limit: number): Promise<Round[]>;

  // ── Betting ─────────────────────────────────────────────────────────────────
  /** Place a trade. Returns the transaction hash and the created bet. */
  placeBet(request: PlaceBetRequest): Promise<PlaceBetResult>;

  /** Get all bets for a wallet address. */
  getUserBets(address: string): Promise<Bet[]>;

  /** Get unclaimed winning bets for a wallet address. */
  getUserClaimable(address: string): Promise<ClaimableWinnings[]>;

  /** Claim winnings for a specific round. */
  claimWinnings(roundId: number, walletAddress: string): Promise<ClaimResult>;

  // ── Signals ─────────────────────────────────────────────────────────────────
  /** Get the current AI signal for the active round. Returns null if unavailable. */
  getAISignal(): Promise<AISignal | null>;
}
