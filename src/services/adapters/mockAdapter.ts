// ─── MockAdapter ──────────────────────────────────────────────────────────────
// Implements IDataAdapter using fully simulated/demo data.
// All simulation logic lives here — UI components and hooks never touch it
// directly; they go through the adapter registry in services/index.ts.
//
// This adapter is active when ACTIVE_ADAPTER === 'mock' (demo mode).
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
  BetDirection,
} from '@/types';
import { TRADING_CONFIG, STORAGE_KEYS } from '@/config/app';

// ── Price simulation state ────────────────────────────────────────────────────

const INITIAL_PRICE = 0.000025;
const PRICE_MIN = 0.00001;
const PRICE_MAX = 0.0001;

let simulatedPrice = INITIAL_PRICE;
let priceVelocity = 0;
let priceHistory: number[] = [INITIAL_PRICE];

// Load persisted price state
try {
  const saved = localStorage.getItem(STORAGE_KEYS.demoPrice);
  const savedHistory = localStorage.getItem(STORAGE_KEYS.demoPriceHistory);
  if (saved) simulatedPrice = parseFloat(saved) || INITIAL_PRICE;
  if (savedHistory) priceHistory = JSON.parse(savedHistory) as number[];
} catch {
  // use defaults
}

function advancePrice(): void {
  const force = (Math.random() - 0.5) * 0.0000005;
  priceVelocity = Math.max(-0.0000005, Math.min(0.0000005, priceVelocity * 0.95 + force));
  simulatedPrice = Math.max(PRICE_MIN, Math.min(PRICE_MAX, simulatedPrice + priceVelocity));
  priceHistory.push(simulatedPrice);
  if (priceHistory.length > 100) priceHistory.shift();
  try {
    localStorage.setItem(STORAGE_KEYS.demoPrice, simulatedPrice.toString());
    localStorage.setItem(STORAGE_KEYS.demoPriceHistory, JSON.stringify(priceHistory));
  } catch {
    // ignore
  }
}

// ── Round price tracking ──────────────────────────────────────────────────────

const roundPrices = new Map<number, { startPrice: number; endPrice: number | null }>();

try {
  const saved = localStorage.getItem(STORAGE_KEYS.demoRoundPrices);
  if (saved) {
    const parsed = JSON.parse(saved) as Record<string, { startPrice: number; endPrice: number | null }>;
    Object.entries(parsed).forEach(([id, prices]) => roundPrices.set(Number(id), prices));
  }
} catch {
  // use defaults
}

function saveRoundPrices(): void {
  try {
    const obj: Record<number, { startPrice: number; endPrice: number | null }> = {};
    roundPrices.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(STORAGE_KEYS.demoRoundPrices, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

// ── Bet storage ───────────────────────────────────────────────────────────────

const simulatedBets = new Map<string, Bet[]>();

try {
  const saved = localStorage.getItem(STORAGE_KEYS.demoBets);
  if (saved) {
    const parsed = JSON.parse(saved) as Record<string, Bet[]>;
    Object.entries(parsed).forEach(([addr, bets]) => simulatedBets.set(addr, bets));
  }
} catch {
  // use defaults
}

function saveBets(): void {
  try {
    const obj: Record<string, Bet[]> = {};
    simulatedBets.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(STORAGE_KEYS.demoBets, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSimulatedTick(): number {
  const baseTime = new Date('2024-01-01').getTime();
  return Math.floor((Date.now() - baseTime) / TRADING_CONFIG.tickDuration);
}

function buildRound(id: number, currentTick: number, isActive: boolean): Round {
  const startTick = id * TRADING_CONFIG.roundDuration;
  const endTick = (id + 1) * TRADING_CONFIG.roundDuration;
  const basePool = Math.floor(Math.random() * 50_000) + 10_000;
  const upPool = Math.floor(basePool * (0.3 + Math.random() * 0.4));
  const downPool = basePool - upPool;
  const priceChange = (Math.random() - 0.5) * 0.0001;
  const startPrice = simulatedPrice - priceChange;
  const endPrice = isActive ? null : simulatedPrice + priceChange;
  const result: BetDirection | null = isActive ? null : (priceChange > 0 ? 'UP' : 'DOWN');

  return {
    id,
    startTick,
    endTick,
    startPrice: startPrice * 1e8,
    endPrice: endPrice ? endPrice * 1e8 : null,
    result,
    totalPool: basePool,
    upPool,
    downPool,
    status: isActive ? 'active' : currentTick >= endTick ? 'completed' : 'pending',
  };
}

// ── MockAdapter implementation ────────────────────────────────────────────────

export class MockAdapter implements IDataAdapter {
  async getLiveTick(): Promise<Tick> {
    return { tick: getSimulatedTick(), timestamp: Date.now() };
  }

  async getCurrentPrice(): Promise<PriceData> {
    advancePrice();
    const oldPrice = priceHistory.length > 50 ? priceHistory[0] : simulatedPrice;
    const change24h = ((simulatedPrice - oldPrice) / oldPrice) * 100;
    return {
      price: simulatedPrice * 1e8,
      change24h,
      timestamp: Date.now(),
    };
  }

  async getCurrentRound(): Promise<Round> {
    const tick = getSimulatedTick();
    const roundId = Math.floor(tick / TRADING_CONFIG.roundDuration);

    if (!roundPrices.has(roundId)) {
      roundPrices.set(roundId, { startPrice: simulatedPrice, endPrice: null });
      saveRoundPrices();
    }

    return buildRound(roundId, tick, true);
  }

  async getRound(id: number): Promise<Round> {
    const tick = getSimulatedTick();
    const currentRoundId = Math.floor(tick / TRADING_CONFIG.roundDuration);
    const isActive = id === currentRoundId;

    if (id < currentRoundId && roundPrices.has(id)) {
      const prices = roundPrices.get(id)!;
      if (prices.endPrice === null) {
        prices.endPrice = simulatedPrice;
        saveRoundPrices();
      }
    }

    return buildRound(id, tick, isActive);
  }

  async getRoundsHistory(limit: number): Promise<Round[]> {
    const tick = getSimulatedTick();
    const currentRoundId = Math.floor(tick / TRADING_CONFIG.roundDuration);
    const rounds: Round[] = [];
    for (let i = 0; i < limit; i++) {
      const roundId = currentRoundId - i - 1;
      if (roundId < 0) break;
      rounds.push(buildRound(roundId, tick, false));
    }
    return rounds;
  }

  async placeBet(request: PlaceBetRequest): Promise<PlaceBetResult> {
    const { direction, amount, walletAddress, walletBalance } = request;

    if (amount < TRADING_CONFIG.minBet || amount > TRADING_CONFIG.maxBet) {
      throw new Error(`Trade amount must be between ${TRADING_CONFIG.minBet} and ${TRADING_CONFIG.maxBet}`);
    }
    if (amount > walletBalance) {
      throw new Error('Insufficient balance');
    }

    const currentRound = await this.getCurrentRound();
    const txHash = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const bet: Bet = {
      id: txHash,
      roundId: currentRound.id,
      address: walletAddress,
      direction,
      amount,
      timestamp: Date.now(),
      claimed: false,
      won: null,
      payout: null,
    };

    const userBets = simulatedBets.get(walletAddress) ?? [];
    userBets.push(bet);
    simulatedBets.set(walletAddress, userBets);
    saveBets();

    // Deduct from demo balance
    try {
      const current = parseFloat(localStorage.getItem(STORAGE_KEYS.demoBalance) || '0');
      localStorage.setItem(STORAGE_KEYS.demoBalance, (current - amount).toString());
      window.dispatchEvent(new Event('wallet-balance-update'));
    } catch {
      // ignore
    }

    return { txHash, bet };
  }

  async getUserBets(address: string): Promise<Bet[]> {
    const bets = simulatedBets.get(address) ?? [];
    const tick = getSimulatedTick();
    const currentRoundId = Math.floor(tick / TRADING_CONFIG.roundDuration);

    let updated = false;
    const resolved = bets.map(bet => {
      if (bet.roundId < currentRoundId && bet.won === null) {
        const prices = roundPrices.get(bet.roundId);
        let won: boolean;
        if (prices && prices.endPrice !== null) {
          const priceUp = prices.endPrice > prices.startPrice;
          won = bet.direction === 'UP' ? priceUp : !priceUp;
        } else {
          won = Math.random() > 0.48;
        }
        updated = true;
        return { ...bet, won, payout: won ? bet.amount * TRADING_CONFIG.payoutMultiplier : 0 };
      }
      return bet;
    });

    if (updated) {
      simulatedBets.set(address, resolved);
      saveBets();
    }

    return [...resolved].sort((a, b) => b.timestamp - a.timestamp);
  }

  async getUserClaimable(address: string): Promise<ClaimableWinnings[]> {
    const bets = await this.getUserBets(address);
    return bets
      .filter(b => b.won === true && !b.claimed)
      .map(b => ({ roundId: b.roundId, amount: b.payout ?? 0, direction: b.direction }));
  }

  async claimWinnings(roundId: number, walletAddress: string): Promise<ClaimResult> {
    const bets = simulatedBets.get(walletAddress) ?? [];
    const idx = bets.findIndex(b => b.roundId === roundId && b.won === true && !b.claimed);

    if (idx === -1) throw new Error('No claimable winnings for this round');

    const bet = bets[idx];
    bets[idx] = { ...bet, claimed: true };
    simulatedBets.set(walletAddress, bets);
    saveBets();

    try {
      const current = parseFloat(localStorage.getItem(STORAGE_KEYS.demoBalance) || '0');
      localStorage.setItem(STORAGE_KEYS.demoBalance, (current + (bet.payout ?? 0)).toString());
      window.dispatchEvent(new Event('wallet-balance-update'));
    } catch {
      // ignore
    }

    return {
      txHash: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      amount: bet.payout ?? 0,
    };
  }

  async getAISignal(): Promise<AISignal | null> {
    // Simulated signal — placeholder until real signal engine is connected
    const directions: BetDirection[] = ['UP', 'DOWN'];
    return {
      direction: directions[Math.floor(Math.random() * 2)],
      confidence: 0.5 + Math.random() * 0.3,
      reasoning: 'Simulated signal — AI engine not yet connected.',
      timestamp: Date.now(),
    };
  }
}
