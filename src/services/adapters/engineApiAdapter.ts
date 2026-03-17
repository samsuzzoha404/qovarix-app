// ─── EngineApiAdapter (scaffold) ──────────────────────────────────────────────
// Placeholder for the off-chain engine API integration.
// Implement this adapter when the Qovarix engine API is ready.
//
// This adapter will:
//   - Fetch live price data from the engine's price feed endpoint
//   - Fetch round state from the engine's round management endpoint
//   - Submit trades via the engine's order submission endpoint
//   - Retrieve user trade history from the engine's history endpoint
//   - Retrieve AI signals from the engine's signal endpoint
//
// TODO (Phase 3+): Replace all `throw new Error('Not implemented')` with real
//   engine API calls. The base URL and auth headers should come from env vars.
// ─────────────────────────────────────────────────────────────────────────────

import type { IDataAdapter } from '@/services/adapter';
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

export class EngineApiAdapter implements IDataAdapter {
  // TODO: inject base URL from env (e.g. import.meta.env.VITE_ENGINE_API_URL)
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getLiveTick(): Promise<Tick> {
    // TODO: GET ${this.baseUrl}/tick
    throw new Error('EngineApiAdapter.getLiveTick: not implemented');
  }

  async getCurrentPrice(): Promise<PriceData> {
    // TODO: GET ${this.baseUrl}/price/current
    throw new Error('EngineApiAdapter.getCurrentPrice: not implemented');
  }

  async getCurrentRound(): Promise<Round> {
    // TODO: GET ${this.baseUrl}/rounds/current
    throw new Error('EngineApiAdapter.getCurrentRound: not implemented');
  }

  async getRound(id: number): Promise<Round> {
    // TODO: GET ${this.baseUrl}/rounds/${id}
    void id;
    throw new Error('EngineApiAdapter.getRound: not implemented');
  }

  async getRoundsHistory(limit: number): Promise<Round[]> {
    // TODO: GET ${this.baseUrl}/rounds/history?limit=${limit}
    void limit;
    throw new Error('EngineApiAdapter.getRoundsHistory: not implemented');
  }

  async placeBet(request: PlaceBetRequest): Promise<PlaceBetResult> {
    // TODO: POST ${this.baseUrl}/trades  { direction, amount, walletAddress }
    void request;
    throw new Error('EngineApiAdapter.placeBet: not implemented');
  }

  async getUserBets(address: string): Promise<Bet[]> {
    // TODO: GET ${this.baseUrl}/trades?address=${address}
    void address;
    throw new Error('EngineApiAdapter.getUserBets: not implemented');
  }

  async getUserClaimable(address: string): Promise<ClaimableWinnings[]> {
    // TODO: GET ${this.baseUrl}/trades/claimable?address=${address}
    void address;
    throw new Error('EngineApiAdapter.getUserClaimable: not implemented');
  }

  async claimWinnings(roundId: number, walletAddress: string): Promise<ClaimResult> {
    // TODO: POST ${this.baseUrl}/trades/claim  { roundId, walletAddress }
    void roundId; void walletAddress;
    throw new Error('EngineApiAdapter.claimWinnings: not implemented');
  }

  async getAISignal(): Promise<AISignal | null> {
    // TODO: GET ${this.baseUrl}/signals/current
    throw new Error('EngineApiAdapter.getAISignal: not implemented');
  }
}
