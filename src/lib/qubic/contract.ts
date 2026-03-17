// ─── contract.ts ─────────────────────────────────────────────────────────────
// Real-wallet contract interaction layer.
//
// In Phase 2 this file is a clean scaffold for the live smart contract path.
// All simulation/demo logic has been moved to:
//   src/services/adapters/mockAdapter.ts
//
// Hooks and providers no longer import from this file directly.
// They go through the adapter registry: src/services/index.ts
//
// TODO (Phase 4+): Implement the functions below using ethers.js / viem
//   when the Qovarix contract is deployed on Base.
// ─────────────────────────────────────────────────────────────────────────────

import { BetDirection, Round } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';

// ── Payout calculation ────────────────────────────────────────────────────────
// Shared utility used by PayoutCalculator component.
// Works for both mock (estimated) and live (pool-based) modes.

export function calculatePayout(amount: number, direction: BetDirection, round: Round): number {
  const pool = direction === 'UP' ? round.upPool : round.downPool;
  const oppositePool = direction === 'UP' ? round.downPool : round.upPool;
  const totalAfterFee = (pool + oppositePool) * (1 - QUBIC_CONFIG.houseFee);
  const share = amount / (pool + amount);
  return totalAfterFee * share;
}

// ── Contract input encoding ───────────────────────────────────────────────────
// Used by SmartContractAdapter when building on-chain transactions.

export function encodeBetInput(direction: BetDirection, roundId: number): Uint8Array {
  const buffer = new ArrayBuffer(5);
  const view = new DataView(buffer);
  view.setUint8(0, direction === 'UP' ? 1 : 0);
  view.setUint32(1, roundId, true);
  return new Uint8Array(buffer);
}

export function encodeClaimInput(roundId: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, roundId, true);
  return new Uint8Array(buffer);
}
