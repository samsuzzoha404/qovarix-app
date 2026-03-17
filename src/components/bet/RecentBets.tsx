import { useUserBets } from '@/hooks/useUserBets';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ResultBadge } from './ResultBadge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { UI_COPY } from '@/config/product';
import { Activity } from 'lucide-react';

interface RecentBetsProps {
  className?: string;
  limit?: number;
}

export function RecentBets({ className, limit = 5 }: RecentBetsProps) {
  const { data: bets, isLoading } = useUserBets();
  const recentBets = bets?.slice(0, limit) || [];

  return (
    <GlassCard className={cn('p-5', className)}>
      <SectionHeader title={UI_COPY.recentTrades} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      ) : recentBets.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-5 w-5 text-muted-foreground" />}
          title={UI_COPY.noTradesYet}
          description="Your recent trades will appear here."
        />
      ) : (
        <div className="space-y-2">
          {recentBets.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/25 hover:bg-muted/45 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ResultBadge direction={bet.direction} size="sm" />
                <div>
                  <div className="metric-value text-sm">
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
                      'metric-value text-sm',
                      bet.won ? 'text-up' : 'text-down'
                    )}
                  >
                    {bet.won
                      ? `+${formatNumber(bet.payout! - bet.amount)}`
                      : `-${formatNumber(bet.amount)}`}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Pending</div>
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
