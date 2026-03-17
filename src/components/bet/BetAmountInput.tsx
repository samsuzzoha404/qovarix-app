import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QUBIC_CONFIG } from '@/config/constants';

interface BetAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  maxBalance: number;
  disabled?: boolean;
  className?: string;
}

const QUICK_AMOUNTS = [10, 50, 100, 500];

export function BetAmountInput({
  value,
  onChange,
  maxBalance,
  disabled = false,
  className,
}: BetAmountInputProps) {
  const handleQuickAmount = (amount: number) => {
    onChange(Math.min(amount, maxBalance));
  };

  const handleMax = () => {
    onChange(Math.min(maxBalance, QUBIC_CONFIG.maxBet));
  };

  const handleHalf = () => {
    onChange(Math.min(maxBalance / 2, QUBIC_CONFIG.maxBet));
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">Trade Amount</label>
        <span className="text-xs text-muted-foreground">
          Available: <span className="text-foreground font-mono tabular-nums">{maxBalance.toFixed(2)} QVX</span>
        </span>
      </div>

      <div className="relative">
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0.00"
          disabled={disabled}
          min={QUBIC_CONFIG.minBet}
          max={Math.min(maxBalance, QUBIC_CONFIG.maxBet)}
          className="text-xl font-mono h-12 pr-14 tabular-nums"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
          QVX
        </span>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {QUICK_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => handleQuickAmount(amount)}
            disabled={disabled || amount > maxBalance}
            className="flex-1 min-w-[52px] text-xs h-8"
          >
            {amount}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={handleHalf}
          disabled={disabled}
          className="flex-1 min-w-[52px] text-xs h-8"
        >
          50%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMax}
          disabled={disabled}
          className="flex-1 min-w-[52px] text-xs h-8 font-semibold"
        >
          MAX
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Min: {QUBIC_CONFIG.minBet} QVX · Max: {QUBIC_CONFIG.maxBet.toLocaleString()} QVX
      </div>
    </div>
  );
}
