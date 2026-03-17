import { useCurrentRound } from '@/hooks/useRound';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface RoundInfoProps {
  className?: string;
}

export function RoundInfo({ className }: RoundInfoProps) {
  const { data: round } = useCurrentRound();

  if (!round) return null;

  const upPercentage = round.totalPool > 0
    ? (round.upPool / round.totalPool) * 100
    : 50;
  const downPercentage = 100 - upPercentage;

  return (
    <GlassCard className={cn('p-5', className)}>
      <SectionHeader
        title={`Round #${round.id}`}
        action={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">{formatNumber(round.totalPool)} QVX</span>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Pool distribution bar */}
        <div className="h-2 rounded-full overflow-hidden bg-muted flex">
          <div
            className="bg-up transition-all duration-500"
            style={{ width: `${upPercentage}%` }}
          />
          <div
            className="bg-down transition-all duration-500"
            style={{ width: `${downPercentage}%` }}
          />
        </div>

        {/* Pool stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-up/8 border border-up/15">
            <div className="flex items-center gap-1.5 text-up mb-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">UP Pool</span>
            </div>
            <div className="metric-value text-base">{formatNumber(round.upPool)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{upPercentage.toFixed(1)}%</div>
          </div>

          <div className="p-3 rounded-lg bg-down/8 border border-down/15">
            <div className="flex items-center gap-1.5 text-down mb-1.5">
              <TrendingDown className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">DOWN Pool</span>
            </div>
            <div className="metric-value text-base">{formatNumber(round.downPool)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{downPercentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Start price */}
        <div className="pt-3 border-t border-border/60">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Starting Price</span>
            <span className="metric-value text-sm">${formatNumber(round.startPrice)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
