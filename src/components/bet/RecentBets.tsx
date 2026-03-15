import { useUserBets } from '@/hooks/useUserBets';
import { GlassCard } from '@/components/ui/glass-card';
import { ResultBadge } from './ResultBadge';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface RecentBetsProps {
  className?: string;
  limit?: number;
}

export function RecentBets({ className, limit = 5 }: RecentBetsProps) {
  const { data: bets, isLoading } = useUserBets();

  const recentBets = bets?.slice(0, limit) || [];

  return (
    <GlassCard className={className}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Recent Bets
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      ) : recentBets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No bets yet
        </div>
      ) : (
        <div className="space-y-3">
          {recentBets.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ResultBadge direction={bet.direction} size="sm" />
                <div>
                  <div className="font-mono font-medium">
                    {formatNumber(bet.amount)} QVX
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Round #{bet.roundId}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {bet.won !== null ? (
                  <div
                    className={cn(
                      "font-mono font-medium",
                      bet.won ? "text-up" : "text-down"
                    )}
                  >
                    {bet.won ? `+${formatNumber(bet.payout! - bet.amount)}` : `-${formatNumber(bet.amount)}`}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Pending</div>
                )}
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(bet.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
