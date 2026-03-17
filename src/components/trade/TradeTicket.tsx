import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentRound } from '@/hooks/useRound';
import { useLiveTick } from '@/hooks/useLiveTick';
import { usePlaceBet } from '@/hooks/usePlaceBet';
import { useWallet } from '@/hooks/useWallet';
import { calculatePayout } from '@/lib/qubic/contract';
import { formatNumber, cn } from '@/lib/utils';
import { QUBIC_CONFIG } from '@/config/constants';
import { UI_COPY } from '@/config/product';
import { BetDirection } from '@/types';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Lock,
  AlertTriangle,
  Wallet,
} from 'lucide-react';

interface TradeTicketProps {
  className?: string;
}

const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

export function TradeTicket({ className }: TradeTicketProps) {
  const { data: round } = useCurrentRound();
  const { data: tick } = useLiveTick();
  const { connected, balance } = useWallet();
  const { mutate: placeBet, isPending, isSuccess, reset } = usePlaceBet();

  const [direction, setDirection] = useState<BetDirection | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [awaitingSettlement, setAwaitingSettlement] = useState(false);

  const amount = parseFloat(amountStr) || 0;

  // Derive round phase
  const ticksRemaining = tick && round ? Math.max(0, round.endTick - tick.tick) : null;
  const isLocking = ticksRemaining !== null && ticksRemaining <= 5 && ticksRemaining > 0;
  const isLocked = round?.status === 'completed' || round?.status === 'resolved' || ticksRemaining === 0;

  // Payout estimates
  const estimatedPayout = direction && round && amount > 0
    ? calculatePayout(amount, direction, round)
    : null;
  const estimatedProfit = estimatedPayout !== null ? estimatedPayout - amount : null;
  const poolShare = direction && round && amount > 0
    ? (() => {
        const pool = direction === 'UP' ? round.upPool : round.downPool;
        return (amount / (pool + amount)) * 100;
      })()
    : null;
  const fee = amount * QUBIC_CONFIG.houseFee;
  const balanceAfter = balance - amount;

  // Track awaiting settlement after success
  useEffect(() => {
    if (isSuccess) {
      setAwaitingSettlement(true);
      setDirection(null);
      setAmountStr('');
      reset();
    }
  }, [isSuccess, reset]);

  // Clear awaiting state when round changes
  useEffect(() => {
    setAwaitingSettlement(false);
  }, [round?.id]);

  function handleSubmit() {
    if (!direction || amount <= 0 || !connected) return;
    placeBet({ direction, amount });
  }

  // ── Submit button sub-component ───────────────────────────────────────────

interface SubmitButtonProps {
  connected: boolean;
  direction: BetDirection | null;
  amount: number;
  balance: number;
  isLocking: boolean;
  isLocked: boolean;
  isPending: boolean;
  onSubmit: () => void;
}

function SubmitButton({ connected, direction, amount, balance, isLocking, isLocked, isPending, onSubmit }: SubmitButtonProps) {
  if (!connected) {
    return (
      <div className="space-y-2">
        <WalletConnectButton className="w-full" size="default" />
        <div className="flex items-center gap-1.5 justify-center">
          <Wallet className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Connect wallet to place trades</span>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="space-y-1.5">
        <Button disabled className="w-full" variant="outline">
          <Lock className="h-4 w-4 mr-2" />
          {UI_COPY.roundLockedWarning}
        </Button>
      </div>
    );
  }

  if (isLocking) {
    return (
      <div className="space-y-1.5">
        <Button disabled className="w-full" variant="outline">
          <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
          {UI_COPY.roundLockWarning}
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <Button disabled className="w-full">
        <Spinner size="sm" className="mr-2" />
        {UI_COPY.placingTrade}
      </Button>
    );
  }

  const insufficientBalance = amount > balance;
  const missingDirection = !direction;
  const missingAmount = amount <= 0;

  if (insufficientBalance) {
    return (
      <div className="space-y-1.5">
        <Button disabled className="w-full" variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          {UI_COPY.insufficientBalance}
        </Button>
      </div>
    );
  }

  const canSubmit = !missingDirection && !missingAmount && !insufficientBalance;

  return (
    <div className="space-y-1.5">
      <Button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={cn(
          'w-full font-semibold transition-all',
          direction === 'UP' && canSubmit && 'bg-up hover:bg-up/90 text-white border-0',
          direction === 'DOWN' && canSubmit && 'bg-down hover:bg-down/90 text-white border-0',
        )}
      >
        {missingDirection ? (
          'Select Direction'
        ) : missingAmount ? (
          'Enter Amount'
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {UI_COPY.placeTrade} {direction}
          </>
        )}
      </Button>
      {canSubmit && (
        <p className="text-[10px] text-center text-muted-foreground">
          Payout is dynamic and updates until round lock
        </p>
      )}
    </div>
  );
}

// ── Awaiting settlement state ──────────────────────────────────────────────
  if (awaitingSettlement) {
    return (
      <div className={cn('space-y-4', className)}>
        <GlassCard className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{UI_COPY.awaitingSettlement}</div>
            <div className="text-xs text-muted-foreground mt-1">{UI_COPY.awaitingSettlementDetail}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setAwaitingSettlement(false)}
          >
            Place Another Trade
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50">
          <SectionHeader title={UI_COPY.placeTradePage} />
          <p className="text-xs text-muted-foreground mt-0.5">{UI_COPY.placeTradeSubtext}</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Direction selector */}
          <div>
            <div className="section-label mb-2">Direction</div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setDirection('UP')}
                disabled={isLocked || isPending}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-4 px-3 rounded-lg border transition-all duration-150',
                  direction === 'UP'
                    ? 'bg-up/8 border-up/50 text-up'
                    : 'border-border/50 text-muted-foreground hover:border-up/30 hover:text-up hover:bg-up/5',
                  (isLocked || isPending) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-semibold">UP</span>
                {round && (
                  <span className="text-[10px] opacity-70">
                    {((round.upPool / (round.totalPool || 1)) * 100).toFixed(0)}% of pool
                  </span>
                )}
              </button>
              <button
                onClick={() => setDirection('DOWN')}
                disabled={isLocked || isPending}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-4 px-3 rounded-lg border transition-all duration-150',
                  direction === 'DOWN'
                    ? 'bg-down/8 border-down/50 text-down'
                    : 'border-border/50 text-muted-foreground hover:border-down/30 hover:text-down hover:bg-down/5',
                  (isLocked || isPending) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <TrendingDown className="h-5 w-5" />
                <span className="text-sm font-semibold">DOWN</span>
                {round && (
                  <span className="text-[10px] opacity-70">
                    {((round.downPool / (round.totalPool || 1)) * 100).toFixed(0)}% of pool
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="section-label">Amount</div>
              {connected && (
                <span className="text-[10px] text-muted-foreground">
                  Balance: <span className="metric-value text-[10px]">{formatNumber(balance)} QVX</span>
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                min={QUBIC_CONFIG.minBet}
                max={QUBIC_CONFIG.maxBet}
                disabled={isLocked || isPending}
                className={cn(
                  'w-full h-12 px-4 pr-14 rounded-lg border bg-background/50 text-sm font-mono font-semibold',
                  'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50',
                  'placeholder:text-muted-foreground/50 transition-colors',
                  amount > balance && connected ? 'border-destructive/60' : 'border-border/60',
                  (isLocked || isPending) && 'opacity-50 cursor-not-allowed'
                )}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                QVX
              </span>
            </div>
            {/* Quick amounts */}
            <div className="flex gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmountStr(String(q))}
                  disabled={isLocked || isPending}
                  className={cn(
                    'flex-1 h-7 text-[11px] font-medium rounded border border-border/50',
                    'hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors',
                    amountStr === String(q) && 'border-primary/50 bg-primary/8 text-primary',
                    (isLocked || isPending) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {q}
                </button>
              ))}
              {connected && (
                <button
                  onClick={() => setAmountStr(String(Math.floor(balance)))}
                  disabled={isLocked || isPending || balance <= 0}
                  className={cn(
                    'flex-1 h-7 text-[11px] font-medium rounded border border-border/50',
                    'hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors',
                    (isLocked || isPending || balance <= 0) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Max
                </button>
              )}
            </div>
          </div>

          {/* Position summary */}
          {amount > 0 && direction && (
            <div className="rounded-lg border border-border/40 bg-muted/20 divide-y divide-border/30">
              <div className="flex justify-between items-center px-3.5 py-2">
                <span className="text-xs text-muted-foreground">Stake</span>
                <span className="metric-value text-xs">{formatNumber(amount)} QVX</span>
              </div>
              <div className="flex justify-between items-center px-3.5 py-2">
                <span className="text-xs text-muted-foreground">{UI_COPY.protocolFeeLabel} (2%)</span>
                <span className="metric-value text-xs text-muted-foreground">−{formatNumber(fee)} QVX</span>
              </div>
              {poolShare !== null && (
                <div className="flex justify-between items-center px-3.5 py-2">
                  <span className="text-xs text-muted-foreground">{UI_COPY.payoutPoolShareLabel}</span>
                  <span className="metric-value text-xs">{poolShare.toFixed(2)}%</span>
                </div>
              )}
              {estimatedPayout !== null && (
                <div className="flex justify-between items-center px-3.5 py-2">
                  <div>
                    <span className="text-xs text-muted-foreground">{UI_COPY.payoutEstimateLabel}</span>
                    <div className="text-[10px] text-muted-foreground/60">{UI_COPY.payoutEstimateNote}</div>
                  </div>
                  <div className="text-right">
                    <div className="metric-value text-xs text-up">{formatNumber(estimatedPayout)} QVX</div>
                    {estimatedProfit !== null && (
                      <div className="text-[10px] text-up">+{formatNumber(estimatedProfit)} profit</div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center px-3.5 py-2">
                <span className="text-xs text-muted-foreground">{UI_COPY.maxLossLabel}</span>
                <span className="metric-value text-xs text-down">−{formatNumber(amount)} QVX</span>
              </div>
              {connected && (
                <div className="flex justify-between items-center px-3.5 py-2">
                  <span className="text-xs text-muted-foreground">{UI_COPY.balanceAfterLabel}</span>
                  <span className={cn('metric-value text-xs', balanceAfter < 0 ? 'text-destructive' : '')}>
                    {formatNumber(Math.max(0, balanceAfter))} QVX
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Submit button area */}
          <SubmitButton
            connected={connected}
            direction={direction}
            amount={amount}
            balance={balance}
            isLocking={isLocking}
            isLocked={isLocked}
            isPending={isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </GlassCard>
    </div>
  );
}
