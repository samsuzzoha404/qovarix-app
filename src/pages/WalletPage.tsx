import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';
import { useWallet } from '@/hooks/useWallet';
import { useUserBets, useUserClaimable } from '@/hooks/useUserBets';
import { useClaimWinnings } from '@/hooks/usePlaceBet';
import { formatNumber, formatAddress, formatTimeAgo, cn } from '@/lib/utils';
import {
  Wallet,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Gift,
  Check,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UI_COPY, TOKEN_LABELS } from '@/config/product';

export default function WalletPage() {
  const { connected, address, balance, disconnect } = useWallet();
  const { data: bets, isLoading: loadingBets } = useUserBets();
  const { data: claimable, isLoading: loadingClaimable } = useUserClaimable();
  const { mutate: claimWinnings, mutateAsync: claimWinningsAsync, isPending: isClaiming } = useClaimWinnings();
  const [copied, setCopied] = useState(false);
  const [isClaimingAll, setIsClaimingAll] = useState(false);
  const { toast } = useToast();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Address copied!' });
    }
  };

  const totalClaimable = claimable?.reduce((sum, c) => sum + c.amount, 0) || 0;
  const hasClaimable = Boolean(claimable && claimable.length > 0);

  const handleClaimAll = async () => {
    if (!claimable?.length || isClaiming || isClaimingAll) return;
    setIsClaimingAll(true);
    let claimedCount = 0;
    try {
      for (const claim of claimable) {
        await claimWinningsAsync(claim.roundId);
        claimedCount += 1;
      }
      toast({
        title: 'All claims processed',
        description: `Claimed ${claimedCount} reward${claimedCount === 1 ? '' : 's'}.`,
      });
    } catch (error) {
      toast({
        title: 'Claim All interrupted',
        description: error instanceof Error ? error.message : 'Some claims could not be completed.',
        variant: 'destructive',
      });
    } finally {
      setIsClaimingAll(false);
    }
  };

  const stats = bets ? {
    totalTrades: bets.length,
    wins: bets.filter(b => b.won === true).length,
    losses: bets.filter(b => b.won === false).length,
    totalWagered: bets.reduce((sum, b) => sum + b.amount, 0),
    winRate: bets.filter(b => b.won !== null).length > 0
      ? ((bets.filter(b => b.won === true).length / bets.filter(b => b.won !== null).length) * 100).toFixed(0)
      : '0',
  } : null;

  if (!connected) {
    return (
      <MainLayout>
        <div className="container py-16">
          <GlassCard className="p-10 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
              View your trading balance, trade history, and claimable rewards.
            </p>
            <WalletConnectButton size="lg" className="w-full" />
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">Wallet</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Info */}
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="section-label mb-1.5">Wallet Address</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold">{formatAddress(address || '', 8)}</span>
                    <Button variant="ghost" size="icon" onClick={copyAddress} className="h-8 w-8">
                      {copied ? <Check className="h-3.5 w-3.5 text-up" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      className="h-8 w-8 cursor-not-allowed opacity-40"
                      title="Explorer link coming in live integration"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label={TOKEN_LABELS.tradingBalance}
                  value={`${formatNumber(balance)} QVX`}
                  sub={TOKEN_LABELS.collateralUnitFull}
                  accent="neutral"
                />
                <MetricCard
                  label={TOKEN_LABELS.claimableLabel}
                  value={`${formatNumber(totalClaimable)} QVX`}
                  sub={TOKEN_LABELS.rewardsLabel}
                  accent="primary"
                />
              </div>
            </GlassCard>

            {/* Stats */}
            {stats && (
              <GlassCard className="p-5">
                <SectionHeader title="Your Statistics" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard label={UI_COPY.totalTrades} value={stats.totalTrades} accent="neutral" />
                  <MetricCard label="Wins" value={stats.wins} accent="up" />
                  <MetricCard label="Losses" value={stats.losses} accent="down" />
                  <MetricCard label="Win Rate" value={`${stats.winRate}%`} accent="neutral" />
                </div>
              </GlassCard>
            )}

            {/* Trade History */}
            <GlassCard className="overflow-hidden p-0">
              <div className="px-5 pt-5 pb-4 border-b border-border/50">
                <SectionHeader title={UI_COPY.tradeHistory} />
              </div>

              {loadingBets ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : bets && bets.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {bets.map((bet) => (
                    <div
                      key={bet.id}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/25 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-1.5 rounded-full',
                          bet.direction === 'UP' ? 'bg-up/12' : 'bg-down/12'
                        )}>
                          {bet.direction === 'UP' ? (
                            <TrendingUp className="h-4 w-4 text-up" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-down" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Round #{bet.roundId}</span>
                            <ResultBadge direction={bet.direction} size="sm" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimeAgo(bet.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="metric-value text-sm">{formatNumber(bet.amount)} QVX</div>
                        {bet.won !== null && (
                          <div className={cn(
                            'text-xs metric-value',
                            bet.won ? 'text-up' : 'text-down'
                          )}>
                            {bet.won
                              ? `+${formatNumber((bet.payout || 0) - bet.amount)}`
                              : `-${formatNumber(bet.amount)}`}
                          </div>
                        )}
                        {bet.won === null && (
                          <div className="text-xs text-muted-foreground">Pending</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Activity className="h-5 w-5 text-muted-foreground" />}
                  title={UI_COPY.noTradesYet}
                  description="Your trade history will appear here."
                />
              )}
            </GlassCard>
          </div>

          {/* Right sidebar — Claimable */}
          <div className="space-y-5">
            <GlassCard className="p-5" glow={totalClaimable > 0 ? 'primary' : 'none'}>
              <SectionHeader
                title={TOKEN_LABELS.claimableLabel}
                action={<Gift className="h-4 w-4 text-primary" />}
              />

              {loadingClaimable ? (
                <div className="flex justify-center py-8">
                  <Spinner size="sm" />
                </div>
              ) : claimable && claimable.length > 0 ? (
                <div className="space-y-2.5">
                  {claimable.map((claim) => (
                    <div
                      key={claim.roundId}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div>
                        <div className="text-xs text-muted-foreground">Round #{claim.roundId}</div>
                        <div className="metric-value text-sm text-primary">
                          +{formatNumber(claim.amount)} QVX
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => claimWinnings(claim.roundId)}
                        disabled={isClaiming}
                      >
                        Claim
                      </Button>
                    </div>
                  ))}

                  <Button
                    className="w-full mt-2"
                    size="sm"
                    onClick={handleClaimAll}
                    disabled={isClaiming || isClaimingAll || !hasClaimable}
                  >
                    {isClaimingAll ? (
                      <><Spinner size="sm" className="mr-2" />Claiming...</>
                    ) : (
                      `Claim All · ${formatNumber(totalClaimable)} QVX`
                    )}
                  </Button>
                </div>
              ) : (
                <EmptyState
                  icon={<Gift className="h-5 w-5 text-muted-foreground" />}
                  title="No rewards to claim"
                  description="Win trades to earn claimable rewards."
                />
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
