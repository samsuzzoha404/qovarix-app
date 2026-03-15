import { Round, Bet, Tick, PriceData, BetDirection, ClaimableWinnings } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';
import { qubicConnector } from './connector';

// Simulation state for demo purposes (when Qovarix SC is not deployed)
let simulatedRoundId = 1000;
let simulatedPrice = 0.000025; // Simulated QU price in USD
let priceHistory: number[] = [simulatedPrice];
let priceVelocity = 0; // Smooth price changes
const PRICE_STORAGE_KEY = 'qubic_demo_price';
const PRICE_HISTORY_KEY = 'qubic_demo_price_history';

// Load saved price state
try {
  const savedPrice = localStorage.getItem(PRICE_STORAGE_KEY);
  const savedHistory = localStorage.getItem(PRICE_HISTORY_KEY);
  if (savedPrice) {
    simulatedPrice = parseFloat(savedPrice);
  }
  if (savedHistory) {
    priceHistory = JSON.parse(savedHistory);
  }
} catch (e) {
  // Use defaults if localStorage fails
}

function generateSimulatedRound(id: number, tick: number, isActive = false): Round {
  const startTick = id * QUBIC_CONFIG.roundDuration;
  const endTick = (id + 1) * QUBIC_CONFIG.roundDuration;
  const basePool = Math.floor(Math.random() * 50000) + 10000;
  const upPool = Math.floor(basePool * (0.3 + Math.random() * 0.4));
  const downPool = basePool - upPool;
  
  // Determine result based on random price movement for completed rounds
  const priceChange = (Math.random() - 0.5) * 0.0001;
  const startPrice = simulatedPrice - priceChange;
  const endPrice = isActive ? null : simulatedPrice + priceChange;
  const result = isActive ? null : (priceChange > 0 ? 'UP' : 'DOWN') as BetDirection;
  
  return {
    id,
    startTick,
    endTick,
    startPrice: startPrice * 1e8, // Convert to integer representation
    endPrice: endPrice ? endPrice * 1e8 : null,
    result,
    totalPool: basePool,
    upPool,
    downPool,
    status: isActive ? 'active' : tick >= endTick ? 'completed' : 'pending',
  };
}

// Smooth price update function
function updateSimulatedPrice(): void {
  // Add momentum to price changes for smoother transitions
  const randomForce = (Math.random() - 0.5) * 0.0000005;
  priceVelocity = priceVelocity * 0.95 + randomForce; // Damping + random force
  
  // Clamp velocity
  priceVelocity = Math.max(-0.0000005, Math.min(0.0000005, priceVelocity));
  
  // Update price
  simulatedPrice += priceVelocity;
  
  // Keep price in reasonable range
  simulatedPrice = Math.max(0.00001, Math.min(0.0001, simulatedPrice));
  
  // Save to history
  priceHistory.push(simulatedPrice);
  if (priceHistory.length > 100) {
    priceHistory.shift();
  }
  
  // Persist to localStorage
  try {
    localStorage.setItem(PRICE_STORAGE_KEY, simulatedPrice.toString());
    localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(priceHistory));
  } catch (e) {
    // Ignore localStorage errors
  }
}

// Contract interaction functions
export async function getLiveTick(): Promise<Tick> {
  try {
    const tick = await qubicConnector.getCurrentTick();
    if (tick > 0) {
      return {
        tick,
        timestamp: Date.now(),
      };
    }
    throw new Error('Invalid tick from connector');
  } catch (error) {
    // Fallback to RPC call
    try {
      const response = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/tick-info`);
      if (response.ok) {
        const data = await response.json();
        return {
          tick: data.tickInfo?.tick ?? data.tick ?? 0,
          timestamp: Date.now(),
        };
      }
    } catch {
      // Continue to simulation fallback
    }
    
    // Simulation fallback - generate a realistic tick based on time
    const baseTime = new Date('2024-01-01').getTime();
    const elapsed = Date.now() - baseTime;
    const simulatedTick = Math.floor(elapsed / QUBIC_CONFIG.tickDuration);
    return {
      tick: simulatedTick,
      timestamp: Date.now(),
    };
  }
}

export async function getCurrentPrice(): Promise<PriceData> {
  // Simulate price with small random fluctuations
  if (QUBIC_CONFIG.simulationMode) {
    // Update price smoothly
    updateSimulatedPrice();
    
    // Calculate 24h change based on price history
    const oldPrice = priceHistory.length > 50 ? priceHistory[0] : simulatedPrice;
    const change24h = ((simulatedPrice - oldPrice) / oldPrice) * 100;
    
    return {
      price: simulatedPrice * 1e8, // Convert to integer representation (like satoshis)
      change24h,
      timestamp: Date.now(),
    };
  }
  
  try {
    // Try to get price from tick-info (this endpoint does exist)
    const tickResponse = await fetch(`${QUBIC_CONFIG.rpcUrl}/v1/tick-info`);
    if (tickResponse.ok) {
      const tickData = await tickResponse.json();
      return {
        price: tickData.price ?? simulatedPrice * 1e8,
        change24h: 0,
        timestamp: Date.now(),
      };
    }
    throw new Error('Failed to fetch price');
  } catch {
    // Fallback to simulated price
    return {
      price: simulatedPrice * 1e8,
      change24h: 0,
      timestamp: Date.now(),
    };
  }
}

export async function getCurrentRound(): Promise<Round> {
  const tick = await getLiveTick();
  const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
  
  if (QUBIC_CONFIG.simulationMode) {
    simulatedRoundId = currentRoundId;
    
    // Track round start price
    if (!roundPrices.has(currentRoundId)) {
      roundPrices.set(currentRoundId, {
        startPrice: simulatedPrice,
        endPrice: null,
      });
      saveRoundPrices();
    }
    
    return generateSimulatedRound(currentRoundId, tick.tick, true);
  }
  
  // If not in simulation mode, try real API (but it won't work since SC doesn't exist)
  return {
    id: currentRoundId,
    startTick: currentRoundId * QUBIC_CONFIG.roundDuration,
    endTick: (currentRoundId + 1) * QUBIC_CONFIG.roundDuration,
    startPrice: 0,
    endPrice: null,
    result: null,
    totalPool: 0,
    upPool: 0,
    downPool: 0,
    status: 'active',
  };
}

export async function getRound(id: number): Promise<Round> {
  const tick = await getLiveTick();
  
  if (QUBIC_CONFIG.simulationMode) {
    const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
    const isActive = id === currentRoundId;
    
    // For completed rounds, record end price
    if (id < currentRoundId && roundPrices.has(id)) {
      const prices = roundPrices.get(id)!;
      if (prices.endPrice === null) {
        prices.endPrice = simulatedPrice;
        saveRoundPrices();
      }
    }
    
    return generateSimulatedRound(id, tick.tick, isActive);
  }
  
  return {
    id,
    startTick: id * QUBIC_CONFIG.roundDuration,
    endTick: (id + 1) * QUBIC_CONFIG.roundDuration,
    startPrice: 0,
    endPrice: null,
    result: null,
    totalPool: 0,
    upPool: 0,
    downPool: 0,
    status: 'pending',
  };
}

export async function getRoundsHistory(limit = 20): Promise<Round[]> {
  const tick = await getLiveTick();
  const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
  
  if (QUBIC_CONFIG.simulationMode) {
    // Generate simulated history
    const rounds: Round[] = [];
    for (let i = 0; i < limit; i++) {
      const roundId = currentRoundId - i - 1;
      if (roundId < 0) break;
      rounds.push(generateSimulatedRound(roundId, tick.tick, false));
    }
    return rounds;
  }
  
  return [];
}

// Simulated bets storage for demo
const simulatedBets: Map<string, Bet[]> = new Map();
const BETS_STORAGE_KEY = 'qubic_demo_bets';
const ROUND_PRICES_KEY = 'qubic_demo_round_prices';

// Round price tracking for bet resolution
const roundPrices: Map<number, { startPrice: number; endPrice: number | null }> = new Map();

// Load saved bets and round prices
try {
  const savedBets = localStorage.getItem(BETS_STORAGE_KEY);
  if (savedBets) {
    const parsedBets = JSON.parse(savedBets);
    Object.entries(parsedBets).forEach(([address, bets]) => {
      simulatedBets.set(address, bets as Bet[]);
    });
  }
  
  const savedRoundPrices = localStorage.getItem(ROUND_PRICES_KEY);
  if (savedRoundPrices) {
    const parsed = JSON.parse(savedRoundPrices);
    Object.entries(parsed).forEach(([roundId, prices]) => {
      roundPrices.set(Number(roundId), prices as { startPrice: number; endPrice: number | null });
    });
  }
} catch (e) {
  // Use defaults if localStorage fails
}

// Save bets to localStorage
function saveBets(): void {
  try {
    const betsObj: Record<string, Bet[]> = {};
    simulatedBets.forEach((bets, address) => {
      betsObj[address] = bets;
    });
    localStorage.setItem(BETS_STORAGE_KEY, JSON.stringify(betsObj));
  } catch (e) {
    // Ignore localStorage errors
  }
}

// Save round prices to localStorage
function saveRoundPrices(): void {
  try {
    const pricesObj: Record<number, { startPrice: number; endPrice: number | null }> = {};
    roundPrices.forEach((prices, roundId) => {
      pricesObj[roundId] = prices;
    });
    localStorage.setItem(ROUND_PRICES_KEY, JSON.stringify(pricesObj));
  } catch (e) {
    // Ignore localStorage errors
  }
}

export async function placeBet(direction: BetDirection, amount: number, walletAddress?: string, walletBalance?: number): Promise<{ txHash: string; bet: Bet }> {
  // In simulation mode, use provided wallet info
  if (QUBIC_CONFIG.simulationMode) {
    const address = walletAddress;
    if (!address) {
      throw new Error('No wallet address');
    }

    if (amount < QUBIC_CONFIG.minBet || amount > QUBIC_CONFIG.maxBet) {
      throw new Error(`Bet amount must be between ${QUBIC_CONFIG.minBet} and ${QUBIC_CONFIG.maxBet}`);
    }

    const balance = walletBalance ?? 0;
    if (amount > balance) {
      throw new Error('Insufficient balance');
    }

    // Get current round
    const currentRound = await getCurrentRound();
    
    // Simulate placing a bet
    const txHash = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bet: Bet = {
      id: txHash,
      roundId: currentRound.id,
      address,
      direction,
      amount,
      timestamp: Date.now(),
      claimed: false,
      won: null,
      payout: null,
    };
    
    // Store in simulated storage
    const userBets = simulatedBets.get(address) ?? [];
    userBets.push(bet);
    simulatedBets.set(address, userBets);
    saveBets();
    
    // Deduct bet amount from demo wallet balance
    const DEMO_BALANCE_KEY = 'qubic_demo_balance';
    try {
      const currentBalance = parseFloat(localStorage.getItem(DEMO_BALANCE_KEY) || '0');
      const newBalance = currentBalance - amount;
      localStorage.setItem(DEMO_BALANCE_KEY, newBalance.toString());
      // Trigger balance update event
      window.dispatchEvent(new Event('wallet-balance-update'));
    } catch (e) {
      // Ignore localStorage errors
    }
    
    return { txHash, bet };
  }

  // Real wallet mode
  if (!qubicConnector.isConnected()) {
    throw new Error('Wallet not connected');
  }

  const address = qubicConnector.getAddress();
  if (!address) {
    throw new Error('No wallet address');
  }

  if (amount < QUBIC_CONFIG.minBet || amount > QUBIC_CONFIG.maxBet) {
    throw new Error(`Bet amount must be between ${QUBIC_CONFIG.minBet} and ${QUBIC_CONFIG.maxBet}`);
  }

  const balance = await qubicConnector.getBalance();
  if (amount > balance) {
    throw new Error('Insufficient balance');
  }

  // Get current round
  const currentRound = await getCurrentRound();
  
  // Build input data for bet
  const inputData = encodeBetInput(direction, currentRound.id);
  
  // Sign and send transaction
  const result = await qubicConnector.signAndSendTx({
    contractId: QUBIC_CONFIG.contractId,
    inputType: 1, // BET input type
    inputData,
    amount,
  });

  if (!result.success) {
    throw new Error(result.message ?? 'Transaction failed');
  }

  const bet: Bet = {
    id: result.txHash,
    roundId: currentRound.id,
    address,
    direction,
    amount,
    timestamp: Date.now(),
    claimed: false,
    won: null,
    payout: null,
  };

  return {
    txHash: result.txHash,
    bet,
  };
}

export async function getUserBets(address: string): Promise<Bet[]> {
  if (QUBIC_CONFIG.simulationMode) {
    // Return simulated bets with updated status
    const bets = simulatedBets.get(address) ?? [];
    const tick = await getLiveTick();
    const currentRoundId = Math.floor(tick.tick / QUBIC_CONFIG.roundDuration);
    
    let betsUpdated = false;
    const updatedBets = bets.map(bet => {
      if (bet.roundId < currentRoundId && bet.won === null) {
        // Determine outcome based on actual price movement
        const prices = roundPrices.get(bet.roundId);
        let won: boolean;
        
        if (prices && prices.endPrice !== null) {
          // Use actual price movement
          const priceUp = prices.endPrice > prices.startPrice;
          won = bet.direction === 'UP' ? priceUp : !priceUp;
        } else {
          // Fallback to random if no price data
          won = Math.random() > 0.48; // Slight house edge
        }
        
        betsUpdated = true;
        return {
          ...bet,
          won,
          payout: won ? bet.amount * 1.9 : 0,
        };
      }
      return bet;
    });
    
    // Save if updated
    if (betsUpdated) {
      simulatedBets.set(address, updatedBets);
      saveBets();
    }
    
    return updatedBets;
  }
  
  return [];
}

export async function getUserClaimable(address: string): Promise<ClaimableWinnings[]> {
  if (QUBIC_CONFIG.simulationMode) {
    const bets = await getUserBets(address);
    return bets
      .filter(bet => bet.won === true && !bet.claimed)
      .map(bet => ({
        roundId: bet.roundId,
        amount: bet.payout ?? 0,
        direction: bet.direction,
      }));
  }
  
  return [];
}

export async function claimWinnings(roundId: number, walletAddress?: string): Promise<{ txHash: string; amount: number }> {
  if (QUBIC_CONFIG.simulationMode) {
    const address = walletAddress;
    if (!address) {
      throw new Error('No wallet address');
    }

    // Simulate claim
    const bets = simulatedBets.get(address) ?? [];
    const betIndex = bets.findIndex(b => b.roundId === roundId && b.won === true && !b.claimed);
    
    if (betIndex === -1) {
      throw new Error('No claimable winnings for this round');
    }
    
    const bet = bets[betIndex];
    bets[betIndex] = { ...bet, claimed: true };
    simulatedBets.set(address, bets);
    saveBets();
    
    // Update demo wallet balance
    const DEMO_BALANCE_KEY = 'qubic_demo_balance';
    try {
      const currentBalance = parseFloat(localStorage.getItem(DEMO_BALANCE_KEY) || '0');
      const newBalance = currentBalance + (bet.payout ?? 0);
      localStorage.setItem(DEMO_BALANCE_KEY, newBalance.toString());
      // Trigger balance update event
      window.dispatchEvent(new Event('wallet-balance-update'));
    } catch (e) {
      // Ignore localStorage errors
    }
    
    return {
      txHash: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: bet.payout ?? 0,
    };
  }

  // Real wallet mode
  if (!qubicConnector.isConnected()) {
    throw new Error('Wallet not connected');
  }
  
  const address = qubicConnector.getAddress();
  if (!address) {
    throw new Error('No wallet address');
  }

  // Build input data for claim
  const inputData = encodeClaimInput(roundId);
  
  // Sign and send transaction
  const result = await qubicConnector.signAndSendTx({
    contractId: QUBIC_CONFIG.contractId,
    inputType: 2, // CLAIM input type
    inputData,
    amount: 0,
  });

  if (!result.success) {
    throw new Error(result.message ?? 'Claim failed');
  }

  return {
    txHash: result.txHash,
    amount: 0, // Amount will be determined by contract
  };
}

// Helper to calculate expected payout
export function calculatePayout(amount: number, direction: BetDirection, round: Round): number {
  const pool = direction === 'UP' ? round.upPool : round.downPool;
  const oppositePool = direction === 'UP' ? round.downPool : round.upPool;
  const totalAfterFee = (pool + oppositePool) * (1 - QUBIC_CONFIG.houseFee);
  const share = amount / (pool + amount);
  return totalAfterFee * share;
}

// Helper functions to map API data to our types
function mapRoundData(data: Record<string, unknown>): Round {
  return {
    id: Number(data.id ?? data.roundId ?? 0),
    startTick: Number(data.startTick ?? 0),
    endTick: Number(data.endTick ?? 0),
    startPrice: Number(data.startPrice ?? 0),
    endPrice: data.endPrice != null ? Number(data.endPrice) : null,
    result: (data.result as BetDirection) ?? null,
    totalPool: Number(data.totalPool ?? 0),
    upPool: Number(data.upPool ?? 0),
    downPool: Number(data.downPool ?? 0),
    status: (data.status as Round['status']) ?? 'pending',
  };
}

function mapBetData(data: Record<string, unknown>): Bet {
  return {
    id: String(data.id ?? data.betId ?? ''),
    roundId: Number(data.roundId ?? 0),
    address: String(data.address ?? ''),
    direction: (data.direction as BetDirection) ?? 'UP',
    amount: Number(data.amount ?? 0),
    timestamp: Number(data.timestamp ?? Date.now()),
    claimed: Boolean(data.claimed),
    won: data.won != null ? Boolean(data.won) : null,
    payout: data.payout != null ? Number(data.payout) : null,
  };
}

function mapClaimableData(data: Record<string, unknown>): ClaimableWinnings {
  return {
    roundId: Number(data.roundId ?? 0),
    amount: Number(data.amount ?? 0),
    direction: (data.direction as BetDirection) ?? 'UP',
  };
}

// Encode bet input for contract
function encodeBetInput(direction: BetDirection, roundId: number): Uint8Array {
  const buffer = new ArrayBuffer(5);
  const view = new DataView(buffer);
  view.setUint8(0, direction === 'UP' ? 1 : 0);
  view.setUint32(1, roundId, true); // little-endian
  return new Uint8Array(buffer);
}

// Encode claim input for contract
function encodeClaimInput(roundId: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, roundId, true); // little-endian
  return new Uint8Array(buffer);
}
