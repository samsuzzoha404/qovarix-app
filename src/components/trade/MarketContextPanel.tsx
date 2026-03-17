import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { PriceDisplay } from '@/components/bet/PriceDisplay';
import { PriceChart } from '@/components/bet/PriceChart';
import { CountdownTimer } from '@/components/bet/CountdownTimer';
import { RoundStatusBadge } from '@/components/dashboard/RoundStatusBadge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useCurrentRound } from '@/hooks/useRound';
import { useLiveTick } from '@/hooks/useLiveTick';
import { QUBIC_CONFIG } from '@/config/constants';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketContextPanelProps {
  className?: string;
}

export function MarketContextPanel({ className }: MarketContextPanelProps) {
  const { data: round, isLoading } = useCurrentRound();
  const { data: tick } = useLiveTick();
  const [ticksRemaining, setTicksRemaining] = useState(QUBIC_CONFIG.roundDuration);

  useEffect(() => {
    if (tick && round) {
      setTicksRemaining(Math.max(0, round.endTick - tick.tick));
    }
  }, [tick, round]);

  const upPct = round && round.totalPool > 0
    ? (round.upPool / round.totalPool) * 100
    : 50;
  const downPct = 100 - upPct;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Market header card */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <span className="section-label">Market</span>
            {round && (
              <span className="text-xs text-muted-foreground font-mono">Round #{round.id}</span>
            )}
          </div>
          <RoundStatusBadge round={round} ticksRemaining={ticksRemaining} />
        </div>

        {/* Price + Timer */}
        <div className="grid grid-cols-2 divide-x divide-border/50">
          <div className="flex flex-col items-center justify-center py-5 px-4">
            <PriceDisplay size="md" />
          </div>
          <div className="flex flex-col items-center justify-center py-5 px-4">
            <CountdownTimer size="md" />
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 pb-4 pt-3 border-t border-border/40">
          {isLoading ? (
            <div className="h-32 bg-muted/30 rounded-lg animate-pulse" />
          ) : (
            <PriceChart className="h-32" />
          )}
        </div>
      </GlassCard>

      {/* Round details card */}
      {isLoading ? (
        <GlassCard className="p-5">
          <SkeletonCard rows={3} className="p-0" />
        </GlassCard>
      ) : round ? (
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <SectionHeader title="Round Details" />
          </div>

          <div className="p-4 space-y-3">
            {/* Pool bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-up font-medium">{upPct.toFixed(1)}% UP</span>
                <span className="text-down font-medium">DOWN {downPct.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-muted flex">
                <div className="bg-up transition-all duration-500" style={{ width: `${upPct}%` }} />
                <div className="bg-down transition-all duration-500" style={{ width: `${downPct}%` }} />
              </div>
            </div>

            {/* Pool stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-up/8 border border-up/15">
                <div className="flex items-center gap-1 text-up mb-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">UP Pool</span>
                </div>
                <div className="metric-value text-sm">{formatNumber(round.upPool)}</div>
                <div className="text-[10px] text-muted-foreground">QVX</div>
              </div>
              <div className="p-3 rounded-lg bg-down/8 border border-down/15">
                <div className="flex items-center gap-1 text-down mb-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">DOWN Pool</span>
                </div>
                <div className="metric-value text-sm">{formatNumber(round.downPool)}</div>
                <div className="text-[10px] text-muted-foreground">QVX</div>
              </div>
            </div>

            {/* Round meta */}
            <div className="pt-2 border-t border-border/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Start Price</span>
                <span className="metric-value text-xs">${formatNumber(round.startPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Pool</span>
                <span className="metric-value text-xs">{formatNumber(round.totalPool)} QVX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Round Duration</span>
                <span className="metric-value text-xs">{QUBIC_CONFIG.roundDuration}s</span>
              </div>
            </div>
          </div>
        </GlassCard>
      ) : null}
    </div>
  );
}
