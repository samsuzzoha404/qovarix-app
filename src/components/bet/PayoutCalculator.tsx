import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import { QUBIC_CONFIG } from '@/config/constants';
import { BetDirection } from '@/types';
import { useCurrentRound } from '@/hooks/useRound';
import { calculatePayout } from '@/lib/qubic/contract';

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
    <div className={cn("space-y-3 p-4 rounded-lg bg-muted/50", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Your Position</span>
        <span className="font-mono font-medium">{formatNumber(amount)} QVX</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Protocol Fee ({(QUBIC_CONFIG.houseFee * 100).toFixed(0)}%)
        </span>
        <span className="font-mono text-muted-foreground">-{formatNumber(protocolFee)} QVX</span>
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Expected Payout</span>
          <span className="font-mono font-bold text-lg text-primary">
            {formatNumber(estimatedPayout)} QVX
          </span>
        </div>

        {amount > 0 && (
          <>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Potential Profit</span>
              <span className={cn(
                "font-mono font-medium",
                netProfit > 0 ? "text-up" : "text-muted-foreground"
              )}>
                +{formatNumber(netProfit)} QVX
              </span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Multiplier</span>
              <span className="font-mono text-primary font-medium">
                {multiplier.toFixed(2)}x
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
