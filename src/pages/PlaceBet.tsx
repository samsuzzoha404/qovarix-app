import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketContextPanel } from '@/components/trade/MarketContextPanel';
import { TradeTicket } from '@/components/trade/TradeTicket';
import { TradeIntelPanel } from '@/components/trade/TradeIntelPanel';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';

export default function PlaceBet() {
  const [searchParams] = useSearchParams();
  // searchParams.get('direction') is passed down via URL — TradeTicket reads it if needed
  void searchParams;

  return (
    <MainLayout>
      <DashboardTopBar />
      <div className="container py-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-5">
          {/* Left — Market context */}
          <MarketContextPanel />

          {/* Center — Trade ticket */}
          <TradeTicket />

          {/* Right — Intel rail */}
          <TradeIntelPanel />
        </div>
      </div>
    </MainLayout>
  );
}
