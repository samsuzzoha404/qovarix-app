import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
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
  Check
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function WalletPage() {
  const { connected, address, balance, connect, disconnect, isConnecting } = useWallet();
  const { data: bets, isLoading: loadingBets } = useUserBets();
  const { data: claimable, isLoading: loadingClaimable } = useUserClaimable();
  const { mutate: claimWinnings, isPending: isClaiming } = useClaimWinnings();
  const [copied, setCopied] = useState(false);
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

  const stats = bets ? {
    totalBets: bets.length,
    wins: bets.filter(b => b.won === true).length,
    losses: bets.filter(b => b.won === false).length,
    pending: bets.filter(b => b.won === null).length,
    totalWagered: bets.reduce((sum, b) => sum + b.amount, 0),
    totalWon: bets.filter(b => b.won).reduce((sum, b) => sum + (b.payout || 0), 0),
  } : null;

  if (!connected) {
    return (
      <MainLayout>
        <div className="container py-16">
          <GlassCard className="p-10 text-center max-w-md mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              View your balance, bets history, and claimable winnings
            </p>
            <WalletConnectButton size="lg" className="w-full py-6" />
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-10 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Wallet</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Info */}
            <GlassCard className="p-8 shadow-xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Wallet Address</div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-semibold">{formatAddress(address || '', 8)}</span>
                    <Button variant="ghost" size="icon" onClick={copyAddress}>
                      {copied ? <Check className="h-4 w-4 text-up" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-muted/60 border border-border/50">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Balance</div>
                  <div className="text-3xl font-bold font-mono">{formatNumber(balance)} QVX</div>
                </div>
                <div className="p-4 rounded-lg bg-primary/10">
                  <div className="text-sm text-muted-foreground mb-1">Claimable Winnings</div>
                  <div className="text-3xl font-bold font-mono text-primary">
                    {formatNumber(totalClaimable)} QVX
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Stats */}
            {stats && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Your Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold">{stats.totalBets}</div>
                    <div className="text-xs text-muted-foreground">Total Bets</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-up/10">
                    <div className="text-2xl font-bold text-up">{stats.wins}</div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-down/10">
                    <div className="text-2xl font-bold text-down">{stats.losses}</div>
                    <div className="text-xs text-muted-foreground">Losses</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold">
                      {stats.totalBets > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100 || 0).toFixed(0) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Bet History */}
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Bet History
              </h3>

              {loadingBets ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : bets && bets.length > 0 ? (
                <div className="space-y-3">
                  {bets.map((bet) => (
                    <div
                      key={bet.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-full",
                          bet.direction === 'UP' ? "bg-up/20" : "bg-down/20"
                        )}>
                          {bet.direction === 'UP' ? (
                            <TrendingUp className="h-5 w-5 text-up" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-down" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Round #{bet.roundId}</span>
                            <ResultBadge direction={bet.direction} size="sm" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(bet.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-medium">{formatNumber(bet.amount)} QVX</div>
                        {bet.won !== null && (
                          <div className={cn(
                            "text-sm font-mono",
                            bet.won ? "text-up" : "text-down"
                          )}>
                            {bet.won ? `+${formatNumber((bet.payout || 0) - bet.amount)}` : `-${formatNumber(bet.amount)}`}
                          </div>
                        )}
                        {bet.won === null && (
                          <div className="text-sm text-muted-foreground">Pending</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No bets yet
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right sidebar - Claimable */}
          <div className="space-y-6">
            <GlassCard className="p-6" glow={totalClaimable > 0 ? 'primary' : 'none'}>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Claimable Winnings
                </h3>
              </div>

              {loadingClaimable ? (
                <div className="flex justify-center py-8">
                  <Spinner size="sm" />
                </div>
              ) : claimable && claimable.length > 0 ? (
                <div className="space-y-3">
                  {claimable.map((claim) => (
                    <div
                      key={claim.roundId}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div>
                        <div className="text-sm text-muted-foreground">Round #{claim.roundId}</div>
                        <div className="font-mono font-bold text-primary">
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
                    className="w-full mt-4"
                    disabled={isClaiming}
                  >
                    Claim All ({formatNumber(totalClaimable)} QVX)
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No winnings to claim
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
