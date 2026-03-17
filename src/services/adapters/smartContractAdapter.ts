// ─── SmartContractAdapter (scaffold) ─────────────────────────────────────────
// Placeholder for the on-chain smart contract integration.
// Implement this adapter when the Qovarix contract is deployed on Base.
//
// This adapter will:
//   - Read round state directly from the contract (via ethers.js / viem)
//   - Submit trades as on-chain transactions
//   - Read user positions from contract events or view functions
//   - Claim winnings via contract call
//   - Read price from a Chainlink or on-chain oracle
//
// TODO (Phase 4+): Replace all `throw new Error('Not implemented')` with real
//   contract calls. Contract address and ABI should come from config/constants.
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

export class SmartContractAdapter implements IDataAdapter {
  // TODO: inject contract address and provider from wallet context
  // private readonly contractAddress: string;
  // private readonly provider: ethers.Provider;

  async getLiveTick(): Promise<Tick> {
    // TODO: read block number from provider as tick proxy
    throw new Error('SmartContractAdapter.getLiveTick: not implemented');
  }

  async getCurrentPrice(): Promise<PriceData> {
    // TODO: call oracle.latestRoundData() or equivalent
    throw new Error('SmartContractAdapter.getCurrentPrice: not implemented');
  }

  async getCurrentRound(): Promise<Round> {
    // TODO: call contract.getCurrentRound()
    throw new Error('SmartContractAdapter.getCurrentRound: not implemented');
  }

  async getRound(id: number): Promise<Round> {
    // TODO: call contract.getRound(id)
    void id;
    throw new Error('SmartContractAdapter.getRound: not implemented');
  }

  async getRoundsHistory(limit: number): Promise<Round[]> {
    // TODO: query RoundSettled events, limit to `limit` most recent
    void limit;
    throw new Error('SmartContractAdapter.getRoundsHistory: not implemented');
  }

  async placeBet(request: PlaceBetRequest): Promise<PlaceBetResult> {
    // TODO: call contract.placeBet(direction, roundId) with value = amount
    void request;
    throw new Error('SmartContractAdapter.placeBet: not implemented');
  }

  async getUserBets(address: string): Promise<Bet[]> {
    // TODO: query BetPlaced events filtered by address
    void address;
    throw new Error('SmartContractAdapter.getUserBets: not implemented');
  }

  async getUserClaimable(address: string): Promise<ClaimableWinnings[]> {
    // TODO: call contract.getClaimable(address)
    void address;
    throw new Error('SmartContractAdapter.getUserClaimable: not implemented');
  }

  async claimWinnings(roundId: number, walletAddress: string): Promise<ClaimResult> {
    // TODO: call contract.claimWinnings(roundId) from walletAddress
    void roundId; void walletAddress;
    throw new Error('SmartContractAdapter.claimWinnings: not implemented');
  }

  async getAISignal(): Promise<AISignal | null> {
    // AI signals are off-chain; delegate to engine API or return null
    return null;
  }
}
