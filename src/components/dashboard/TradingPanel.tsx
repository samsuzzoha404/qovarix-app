import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useCurrentRound } from '@/hooks/useRound';
import { useWallet } from '@/hooks/useWallet';
import { formatNumber } from '@/lib/utils';
import { calculatePayout } from '@/lib/qubic/contract';
import { ROUTES, QUBIC_CONFIG } from '@/config/constants';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';

interface TradingPanelProps {
  className?: string;
}

export function TradingPanel({ className }: TradingPanelProps) {
  const { data: round, isLoading } = useCurrentRound();
  const { connected } = useWallet();

  const upPct = round && round.totalPool > 0
    ? (round.upPool / round.totalPool) * 100
    : 50;
  const downPct = 100 - upPct;

  const defaultAmount = 100;
  const upPayout = round ? calculatePayout(defaultAmount, 'UP', round) : 0;
  const downPayout = round ? calculatePayout(defaultAmount, 'DOWN', round) : 0;
  const upMultiplier = defaultAmount > 0 ? upPayout / defaultAmount : 0;
  const downMultiplier = defaultAmount > 0 ? downPayout / defaultAmount : 0;

  return (
    <GlassCard className={cn('p-0 overflow-hidden', className)}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
        <span className="section-label">Active Round</span>
        {round && (
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            Pool: {formatNumber(round.totalPool)} QVX
          </span>
        )}
      </div>

      {isLoading ? (
        <SkeletonCard rows={4} className="p-5" />
      ) : !round ? (
        <div className="p-5 text-center text-sm text-muted-foreground py-10">
          No active round
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {/* Pool imbalance bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-up font-semibold">{upPct.toFixed(1)}% UP</span>
              <span className="text-down font-semibold">DOWN {downPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-muted flex">
              <div
                className="bg-up transition-all duration-500"
                style={{ width: `${upPct}%` }}
              />
              <div
                className="bg-down transition-all duration-500"
                style={{ width: `${downPct}%` }}
              />
            </div>
          </div>

          {/* Pool stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-up/8 border border-up/15">
              <div className="flex items-center gap-1.5 text-up mb-2">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">UP Pool</span>
              </div>
              <div className="metric-value text-lg">{formatNumber(round.upPool)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">QVX</div>
            </div>
            <div className="p-3.5 rounded-lg bg-down/8 border border-down/15">
              <div className="flex items-center gap-1.5 text-down mb-2">
                <TrendingDown className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">DOWN Pool</span>
              </div>
              <div className="metric-value text-lg">{formatNumber(round.downPool)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">QVX</div>
            </div>
          </div>

          {/* Payout estimates for 100 QVX */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Est. payout for 100 QVX
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-up">UP</span>
                <span className="metric-value text-sm text-up">{upMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-down">DOWN</span>
                <span className="metric-value text-sm text-down">{downMultiplier.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          {/* Quick trade buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link to={`${ROUTES.bet}?direction=UP`} className="block">
              <button
                className={cn(
                  'w-full flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border transition-all duration-200',
                  'border-up/30 bg-up/6 hover:bg-up/12 hover:border-up/50 hover:scale-[1.02] active:scale-[0.99]',
                  !connected && 'opacity-60'
                )}
              >
                <div className="p-2 rounded-full bg-up/15">
                  <ArrowUp className="h-5 w-5 text-up" />
                </div>
                <span className="text-sm font-bold text-up">UP</span>
                <span className="text-[10px] text-muted-foreground">Price increases</span>
              </button>
            </Link>

            <Link to={`${ROUTES.bet}?direction=DOWN`} className="block">
              <button
                className={cn(
                  'w-full flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border transition-all duration-200',
                  'border-down/30 bg-down/6 hover:bg-down/12 hover:border-down/50 hover:scale-[1.02] active:scale-[0.99]',
                  !connected && 'opacity-60'
                )}
              >
                <div className="p-2 rounded-full bg-down/15">
                  <ArrowDown className="h-5 w-5 text-down" />
                </div>
                <span className="text-sm font-bold text-down">DOWN</span>
                <span className="text-[10px] text-muted-foreground">Price decreases</span>
              </button>
            </Link>
          </div>

          {/* Full trade CTA */}
          <Link to={ROUTES.bet} className="block">
            <Button
              className="w-full glow-primary"
              size="sm"
              disabled={!connected}
            >
              Open Full Trade Panel
            </Button>
          </Link>

          {!connected && (
            <p className="text-center text-xs text-muted-foreground">
              Connect wallet to trade
            </p>
          )}

          {/* Protocol fee note */}
          <div className="text-center text-[10px] text-muted-foreground">
            {(QUBIC_CONFIG.houseFee * 100).toFixed(0)}% protocol fee · Non-custodial
          </div>
        </div>
      )}
    </GlassCard>
  );
}
