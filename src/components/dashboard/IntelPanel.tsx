import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { AISignalCard } from '@/components/dashboard/AISignalCard';
import { FairnessCard } from '@/components/dashboard/FairnessCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useAISignal } from '@/hooks/useAISignal';
import { useRoundsHistory } from '@/hooks/useRoundsHistory';
import { useUserBets } from '@/hooks/useUserBets';
import { useWallet } from '@/hooks/useWallet';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowRight, History, Activity } from 'lucide-react';
import { ROUTES } from '@/config/constants';

interface IntelPanelProps {
  className?: string;
}

export function IntelPanel({ className }: IntelPanelProps) {
  const { data: signal, isLoading: signalLoading } = useAISignal();
  const { data: rounds, isLoading: roundsLoading } = useRoundsHistory(5);
  const { data: bets, isLoading: betsLoading } = useUserBets();
  const { connected } = useWallet();

  const recentBets = bets?.slice(0, 4) || [];

  return (
    <div className={cn('space-y-4', className)}>
      {/* AI Signal */}
      <AISignalCard signal={signal} isLoading={signalLoading} />

      {/* Recent Rounds */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/50">
          <SectionHeader
            title="Recent Rounds"
            action={
              <Link
                to={ROUTES.history}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                All
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
        </div>

        {roundsLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="sm" />
          </div>
        ) : rounds && rounds.length > 0 ? (
          <div className="divide-y divide-border/40">
            {rounds.slice(0, 5).map((round) => {
              const change = round.endPrice && round.startPrice
                ? ((round.endPrice - round.startPrice) / round.startPrice) * 100
                : null;
              return (
                <div key={round.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <ResultBadge direction={round.result} size="sm" />
                    <span className="text-xs text-muted-foreground font-mono">#{round.id}</span>
                  </div>
                  <div className="text-right">
                    {change !== null ? (
                      <span className={cn(
                        'metric-value text-xs',
                        change >= 0 ? 'text-up' : 'text-down'
                      )}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                    <div className="text-[10px] text-muted-foreground">
                      {formatNumber(round.totalPool)} QVX
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<History className="h-4 w-4 text-muted-foreground" />}
            title="No rounds yet"
            className="py-6"
          />
        )}
      </GlassCard>

      {/* Recent Bets */}
      {connected && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/50">
            <SectionHeader
              title="My Trades"
              action={
                <Link
                  to={ROUTES.wallet}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              }
            />
          </div>

          {betsLoading ? (
            <div className="flex justify-center py-6">
              <Spinner size="sm" />
            </div>
          ) : recentBets.length > 0 ? (
            <div className="divide-y divide-border/40">
              {recentBets.map((bet) => (
                <div key={bet.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <ResultBadge direction={bet.direction} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(bet.timestamp)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="metric-value text-xs">{formatNumber(bet.amount)} QVX</div>
                    {bet.won !== null && (
                      <div className={cn(
                        'text-[10px] metric-value',
                        bet.won ? 'text-up' : 'text-down'
                      )}>
                        {bet.won
                          ? `+${formatNumber((bet.payout || 0) - bet.amount)}`
                          : `-${formatNumber(bet.amount)}`}
                      </div>
                    )}
                    {bet.won === null && (
                      <div className="text-[10px] text-muted-foreground">Pending</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              title="No trades yet"
              className="py-6"
            />
          )}
        </GlassCard>
      )}

      {/* Fairness / Transparency */}
      <FairnessCard />
    </div>
  );
}
