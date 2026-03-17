import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { MarketPanel } from '@/components/dashboard/MarketPanel';
import { TradingPanel } from '@/components/dashboard/TradingPanel';
import { IntelPanel } from '@/components/dashboard/IntelPanel';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { useCurrentRound } from '@/hooks/useRound';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, WifiOff, PauseCircle } from 'lucide-react';
import { PRODUCT } from '@/config/product';

export default function Dashboard() {
  const { connected } = useWallet();
  const { data: round, isLoading: roundLoading } = useCurrentRound();
  const { data: price, isLoading: priceLoading } = useCurrentPrice();

  const isLoading = roundLoading || priceLoading;

  return (
    <MainLayout>
      {/* Context strip — market ticker + wallet status */}
      <DashboardTopBar />

      <div className="container py-5 max-w-7xl mx-auto">
        {/* Dashboard states */}
        {isLoading ? (
          <DashboardSkeleton />
        ) : !round && !price ? (
          <NoDataState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px_260px] gap-5">
            {/* Left — Market context */}
            <MarketPanel />

            {/* Center — Active trading zone */}
            <TradingPanel />

            {/* Right — Intelligence + trust rail */}
            <IntelPanel />
          </div>
        )}

        {/* No wallet CTA — shown below the dashboard when disconnected */}
        {!connected && !isLoading && (
          <NoWalletBanner />
        )}
      </div>
    </MainLayout>
  );
}

function NoWalletBanner() {
  return (
    <div className="mt-5">
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">Connect to start trading</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {PRODUCT.tagline}
              </div>
            </div>
          </div>
          <WalletConnectButton size="sm" className="glow-primary shrink-0" />
        </div>
      </GlassCard>
    </div>
  );
}

function NoDataState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="p-4 rounded-full bg-muted">
        <WifiOff className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">No market data</p>
        <p className="text-xs text-muted-foreground mt-1">
          Waiting for the data feed to connect…
        </p>
      </div>
    </div>
  );
}
