import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { CountdownTimer } from '@/components/bet/CountdownTimer';
import { PriceDisplay } from '@/components/bet/PriceDisplay';
import { PriceChart } from '@/components/bet/PriceChart';
import { RoundInfo } from '@/components/bet/RoundInfo';
import { RecentBets } from '@/components/bet/RecentBets';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useRoundsHistory } from '@/hooks/useRoundsHistory';
import { formatNumber } from '@/lib/utils';
import { ArrowUp, ArrowDown, ArrowRight, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { PRODUCT } from '@/config/product';

export default function Dashboard() {
  const { connected } = useWallet();
  const { data: rounds } = useRoundsHistory(5);

  return (
    <MainLayout>
      <div className="container py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">{PRODUCT.heroHeadline}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {PRODUCT.heroSubtext}
          </p>

          {!connected && (
            <div className="flex flex-col items-center gap-4">
              <WalletConnectButton
                size="lg"
                className="glow-primary px-8 py-6 text-lg font-semibold"
              />
              <p className="text-sm text-muted-foreground">Connect to start trading in seconds</p>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trading Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price & Timer Card */}
            <GlassCard className="p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center">
                  <PriceDisplay size="lg" />
                </div>
                <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                  <CountdownTimer size="lg" />
                </div>
              </div>

              {/* Price Chart */}
              <div className="mt-6">
                <PriceChart className="h-40" />
              </div>
            </GlassCard>

            {/* Quick Trade Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Link to={`${ROUTES.bet}?direction=UP`} className="block h-full">
                <GlassCard hover glow="up" className="p-8 text-center h-full transition-all duration-300 hover:scale-[1.02]">
                  <div className="p-4 rounded-full bg-up/20 inline-flex mb-4">
                    <ArrowUp className="h-10 w-10 text-up" />
                  </div>
                  <h3 className="text-2xl font-bold text-up mb-2">UP</h3>
                  <p className="text-sm text-muted-foreground">Price will increase</p>
                  <Button variant="outline" className="mt-4 border-up text-up hover:bg-up/10">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trade UP
                  </Button>
                </GlassCard>
              </Link>

              <Link to={`${ROUTES.bet}?direction=DOWN`} className="block h-full">
                <GlassCard hover glow="down" className="p-8 text-center h-full transition-all duration-300 hover:scale-[1.02]">
                  <div className="p-4 rounded-full bg-down/20 inline-flex mb-4">
                    <ArrowDown className="h-10 w-10 text-down" />
                  </div>
                  <h3 className="text-2xl font-bold text-down mb-2">DOWN</h3>
                  <p className="text-sm text-muted-foreground">Price will decrease</p>
                  <Button variant="outline" className="mt-4 border-down text-down hover:bg-down/10">
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Trade DOWN
                  </Button>
                </GlassCard>
              </Link>
            </div>

            {/* Previous Rounds */}
            <GlassCard className="p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wider">
                  Previous Rounds
                </h3>
                <Link
                  to={ROUTES.history}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-muted-foreground uppercase">
                      <th className="text-left pb-3">Round</th>
                      <th className="text-right pb-3">Start</th>
                      <th className="text-right pb-3">End</th>
                      <th className="text-center pb-3">Result</th>
                      <th className="text-right pb-3">Pool</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rounds?.map((round) => (
                      <tr key={round.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono">#{round.id}</td>
                        <td className="py-3 text-right font-mono">${formatNumber(round.startPrice)}</td>
                        <td className="py-3 text-right font-mono">
                          {round.endPrice ? `$${formatNumber(round.endPrice)}` : '-'}
                        </td>
                        <td className="py-3 text-center">
                          <ResultBadge direction={round.result} size="sm" />
                        </td>
                        <td className="py-3 text-right font-mono">{formatNumber(round.totalPool)} QVX</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Info & Trades */}
          <div className="space-y-6">
            <RoundInfo />
            <RecentBets limit={5} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
