import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import { QUBIC_CONFIG } from '@/config/constants';
import { BetDirection } from '@/types';
import { useCurrentRound } from '@/hooks/useRound';
import { calculatePayout } from '@/lib/qubic/contract';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';

interface PayoutCalculatorProps {
  amount: number;
  direction: BetDirection | null;
  className?: string;
}

export function PayoutCalculator({ amount, direction, className }: PayoutCalculatorProps) {
  const { data: round } = useCurrentRound();

  const protocolFee = amount * QUBIC_CONFIG.houseFee;
  const estimatedPayout = amount && direction && round
    ? calculatePayout(amount, direction, round)
    : 0;
  const netProfit = estimatedPayout - amount;
  const multiplier = amount > 0 ? estimatedPayout / amount : 0;

  return (
    <GlassCard className={cn('p-5', className)}>
      <SectionHeader title="Payout Estimate" />

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Your Position</span>
          <span className="metric-value text-sm">{formatNumber(amount)} QVX</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Protocol Fee ({(QUBIC_CONFIG.houseFee * 100).toFixed(0)}%)
          </span>
          <span className="metric-value text-sm text-muted-foreground">
            -{formatNumber(protocolFee)} QVX
          </span>
        </div>

        <div className="border-t border-border/60 pt-2.5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Expected Payout</span>
            <span className="metric-value text-lg text-primary">
              {formatNumber(estimatedPayout)} QVX
            </span>
          </div>

          {amount > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Potential Profit</span>
                <span className={cn(
                  'metric-value text-sm',
                  netProfit > 0 ? 'text-up' : 'text-muted-foreground'
                )}>
                  +{formatNumber(netProfit)} QVX
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Multiplier</span>
                <span className="metric-value text-sm text-primary">
                  {multiplier.toFixed(2)}x
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
