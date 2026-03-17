import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { CountdownTimer } from '@/components/bet/CountdownTimer';
import { PriceDisplay } from '@/components/bet/PriceDisplay';
import { BetDirectionSelector } from '@/components/bet/BetDirectionSelector';
import { BetAmountInput } from '@/components/bet/BetAmountInput';
import { PayoutCalculator } from '@/components/bet/PayoutCalculator';
import { RoundInfo } from '@/components/bet/RoundInfo';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useWallet } from '@/hooks/useWallet';
import { usePlaceBet } from '@/hooks/usePlaceBet';
import { useCurrentRound } from '@/hooks/useRound';
import { BetDirection } from '@/types';
import { QUBIC_CONFIG } from '@/config/constants';
import { UI_COPY, PRODUCT } from '@/config/product';
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PlaceBet() {
  const [searchParams] = useSearchParams();
  const initialDirection = searchParams.get('direction') as BetDirection | null;

  const [direction, setDirection] = useState<BetDirection | null>(initialDirection);
  const [amount, setAmount] = useState(100);
  const [betPlaced, setBetPlaced] = useState(false);

  const { connected, balance } = useWallet();
  const { mutate: placeBet, isPending: isPlacingBet } = usePlaceBet();
  const { data: round } = useCurrentRound();

  useEffect(() => {
    if (initialDirection) {
      setDirection(initialDirection);
    }
  }, [initialDirection]);

  const handlePlaceBet = () => {
    if (!direction || amount <= 0) return;

    placeBet(
      { direction, amount },
      {
        onSuccess: () => {
          setBetPlaced(true);
          setTimeout(() => setBetPlaced(false), 3000);
          setDirection(null);
          setAmount(100);
        },
      }
    );
  };

  const canPlaceBet = connected && direction && amount >= QUBIC_CONFIG.minBet && amount <= balance;

  return (
    <MainLayout>
      <div className="container py-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{UI_COPY.placeTradePage}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {UI_COPY.placeTradeSubtext('1.96')}
          </p>
        </div>

        {!connected ? (
          <GlassCard className="p-10 text-center max-w-md mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Connect your wallet to place trades on {PRODUCT.name}
            </p>
            <WalletConnectButton size="lg" className="w-full py-6" />
          </GlassCard>
        ) : betPlaced ? (
          <GlassCard className="p-10 text-center max-w-md mx-auto shadow-2xl" glow="primary">
            <div className="w-20 h-20 rounded-full bg-up/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-up" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{UI_COPY.tradePlacedTitle}</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {UI_COPY.tradePlacedSubtext}
            </p>
            <CountdownTimer size="md" />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main trading form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price & Timer */}
              <GlassCard className="p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <PriceDisplay size="md" />
                  <div className="border-l border-border pl-6">
                    <CountdownTimer size="md" />
                  </div>
                </div>
              </GlassCard>

              {/* Direction Selector */}
              <GlassCard className="p-8 shadow-xl">
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wider mb-6">
                  1. Select Direction
                </h3>
                <BetDirectionSelector
                  selected={direction}
                  onSelect={setDirection}
                  disabled={isPlacingBet}
                />
              </GlassCard>

              {/* Amount Input */}
              <GlassCard className="p-8 shadow-xl">
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wider mb-6">
                  2. Enter Amount
                </h3>
                <BetAmountInput
                  value={amount}
                  onChange={setAmount}
                  maxBalance={balance}
                  disabled={isPlacingBet}
                />
              </GlassCard>

              {/* Submit Button */}
              <Button
                onClick={handlePlaceBet}
                disabled={!canPlaceBet || isPlacingBet}
                size="lg"
                className="w-full h-16 text-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 hover:scale-[1.02]"
              >
                {isPlacingBet ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {UI_COPY.placingTrade}
                  </>
                ) : (
                  <>
                    {UI_COPY.placeTrade}
                    {direction && amount > 0 && ` • ${direction} • ${amount} QVX`}
                  </>
                )}
              </Button>

              {/* Warnings */}
              {amount > balance && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-down/10 text-down text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  {UI_COPY.insufficientBalance}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <PayoutCalculator amount={amount} direction={direction} />
              <RoundInfo />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
