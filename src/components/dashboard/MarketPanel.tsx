import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { PriceDisplay } from '@/components/bet/PriceDisplay';
import { PriceChart } from '@/components/bet/PriceChart';
import { CountdownTimer } from '@/components/bet/CountdownTimer';
import { RoundStatusBadge } from '@/components/dashboard/RoundStatusBadge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useCurrentRound } from '@/hooks/useRound';
import { useLiveTick } from '@/hooks/useLiveTick';
import { QUBIC_CONFIG } from '@/config/constants';
import { cn } from '@/lib/utils';

interface MarketPanelProps {
  className?: string;
}

export function MarketPanel({ className }: MarketPanelProps) {
  const { data: round, isLoading: roundLoading } = useCurrentRound();
  const { data: tick } = useLiveTick();
  const [ticksRemaining, setTicksRemaining] = useState(QUBIC_CONFIG.roundDuration);

  useEffect(() => {
    if (tick && round) {
      setTicksRemaining(Math.max(0, round.endTick - tick.tick));
    }
  }, [tick, round]);

  return (
    <GlassCard className={cn('p-0 overflow-hidden', className)}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <span className="section-label">Market</span>
          {round && (
            <span className="text-xs text-muted-foreground font-mono">
              Round #{round.id}
            </span>
          )}
        </div>
        <RoundStatusBadge round={round} ticksRemaining={ticksRemaining} />
      </div>

      {/* Price + Timer row */}
      <div className="grid grid-cols-2 divide-x divide-border/50">
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <PriceDisplay size="lg" />
        </div>
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <CountdownTimer size="lg" />
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-4 border-t border-border/40 pt-3">
        {roundLoading ? (
          <SkeletonCard rows={1} className="h-36 p-0" />
        ) : (
          <PriceChart className="h-36" />
        )}
      </div>

      {/* Round meta row */}
      {round && (
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/40 bg-muted/20">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Start Price</span>
              <div className="metric-value text-xs">${round.startPrice.toFixed(2)}</div>
            </div>
            {round.endPrice && (
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">End Price</span>
                <div className="metric-value text-xs">${round.endPrice.toFixed(2)}</div>
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</span>
            <div className="metric-value text-xs">{QUBIC_CONFIG.roundDuration}s</div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
