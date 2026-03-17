import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { AISignalCard } from '@/components/dashboard/AISignalCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useAISignal } from '@/hooks/useAISignal';
import { useRoundsHistory } from '@/hooks/useRoundsHistory';
import { useUserBets } from '@/hooks/useUserBets';
import { useWallet } from '@/hooks/useWallet';
import { formatNumber, formatTimeAgo, cn } from '@/lib/utils';
import { ArrowRight, History, Activity, AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { PRODUCT } from '@/config/product';

interface TradeIntelPanelProps {
  className?: string;
}

export function TradeIntelPanel({ className }: TradeIntelPanelProps) {
  const { data: signal, isLoading: signalLoading } = useAISignal();
  const { data: rounds, isLoading: roundsLoading } = useRoundsHistory(5);
  const { data: bets, isLoading: betsLoading } = useUserBets();
  const { connected } = useWallet();

  const recentBets = bets?.slice(0, 3) || [];
  const pendingBets = bets?.filter(b => b.won === null) || [];
  const totalExposure = pendingBets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className={cn('space-y-4', className)}>
      {/* AI Signal */}
      <AISignalCard signal={signal} isLoading={signalLoading} />

      {/* User exposure summary */}
      {connected && totalExposure > 0 && (
        <GlassCard className="p-4">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-warning/10 shrink-0 mt-0.5">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground mb-0.5">Open Exposure</div>
              <div className="text-xs text-muted-foreground">
                You have{' '}
                <span className="metric-value text-xs text-warning">{formatNumber(totalExposure)} QVX</span>
                {' '}in {pendingBets.length} pending position{pendingBets.length !== 1 ? 's' : ''}.
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Recent rounds */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50">
          <SectionHeader
            title="Recent Rounds"
            action={
              <Link
                to={ROUTES.history}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                All <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
        </div>

        {roundsLoading ? (
          <div className="flex justify-center py-5">
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
                  <div className="flex items-center gap-2">
                    <ResultBadge direction={round.result} size="sm" />
                    <span className="text-xs text-muted-foreground font-mono">#{round.id}</span>
                  </div>
                  <div className="text-right">
                    {change !== null ? (
                      <span className={cn('metric-value text-xs', change >= 0 ? 'text-up' : 'text-down')}>
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
            className="py-5"
          />
        )}
      </GlassCard>

      {/* My recent trades */}
      {connected && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <SectionHeader
              title="My Trades"
              action={
                <Link
                  to={ROUTES.wallet}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  All <ArrowRight className="h-3 w-3" />
                </Link>
              }
            />
          </div>

          {betsLoading ? (
            <div className="flex justify-center py-5">
              <Spinner size="sm" />
            </div>
          ) : recentBets.length > 0 ? (
            <div className="divide-y divide-border/40">
              {recentBets.map((bet) => (
                <div key={bet.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <ResultBadge direction={bet.direction} size="sm" />
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(bet.timestamp)}</span>
                  </div>
                  <div className="text-right">
                    <div className="metric-value text-xs">{formatNumber(bet.amount)} QVX</div>
                    {bet.won !== null ? (
                      <div className={cn('text-[10px] metric-value', bet.won ? 'text-up' : 'text-down')}>
                        {bet.won
                          ? `+${formatNumber((bet.payout || 0) - bet.amount)}`
                          : `-${formatNumber(bet.amount)}`}
                      </div>
                    ) : (
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
              className="py-5"
            />
          )}
        </GlassCard>
      )}

      {/* Fairness note */}
      <GlassCard className="p-4">
        <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
          <p className="font-semibold text-xs text-foreground mb-1.5">How payouts work</p>
          <p>Winners share the opposing pool after a {(2).toFixed(0)}% protocol fee. Payout is dynamic and depends on pool participation at round lock.</p>
          <p className="mt-1.5">{PRODUCT.aiDisclaimer}</p>
        </div>
      </GlassCard>
    </div>
  );
}
