import { useCurrentRound } from '@/hooks/useRound';
import { GlassCard } from '@/components/ui/glass-card';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

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
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Round #{round.id}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="font-mono">{formatNumber(round.totalPool)} QVX</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Pool distribution bar */}
        <div className="h-3 rounded-full overflow-hidden bg-muted flex">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-up/10">
            <div className="flex items-center gap-2 text-up mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">UP Pool</span>
            </div>
            <div className="font-mono font-bold">{formatNumber(round.upPool)} QVX</div>
            <div className="text-xs text-muted-foreground">{upPercentage.toFixed(1)}%</div>
          </div>

          <div className="p-3 rounded-lg bg-down/10">
            <div className="flex items-center gap-2 text-down mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">DOWN Pool</span>
            </div>
            <div className="font-mono font-bold">{formatNumber(round.downPool)} QVX</div>
            <div className="text-xs text-muted-foreground">{downPercentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Start price */}
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Starting Price</span>
            <span className="font-mono font-medium">${formatNumber(round.startPrice)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
