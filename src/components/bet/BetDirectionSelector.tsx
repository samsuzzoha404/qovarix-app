import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { BetDirection } from '@/types';

interface BetDirectionSelectorProps {
  selected: BetDirection | null;
  onSelect: (direction: BetDirection) => void;
  disabled?: boolean;
  className?: string;
}

export function BetDirectionSelector({
  selected,
  onSelect,
  disabled = false,
  className,
}: BetDirectionSelectorProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <button
        onClick={() => onSelect('UP')}
        disabled={disabled}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border transition-all duration-200',
          'hover:scale-[1.015] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          selected === 'UP'
            ? 'border-up/50 bg-up/8 glow-up'
            : 'border-border bg-card hover:border-up/30 hover:bg-up/4',
          disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-card hover:border-border'
        )}
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            selected === 'UP' ? 'bg-up/15 text-up' : 'bg-muted text-muted-foreground'
          )}
        >
          <ArrowUp className="h-7 w-7" />
        </div>
        <span className={cn(
          'text-lg font-bold tracking-wide',
          selected === 'UP' ? 'text-up' : 'text-foreground'
        )}>
          UP
        </span>
        <span className="text-xs text-muted-foreground">Price will increase</span>
      </button>

      <button
        onClick={() => onSelect('DOWN')}
        disabled={disabled}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border transition-all duration-200',
          'hover:scale-[1.015] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          selected === 'DOWN'
            ? 'border-down/50 bg-down/8 glow-down'
            : 'border-border bg-card hover:border-down/30 hover:bg-down/4',
          disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-card hover:border-border'
        )}
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            selected === 'DOWN' ? 'bg-down/15 text-down' : 'bg-muted text-muted-foreground'
          )}
        >
          <ArrowDown className="h-7 w-7" />
        </div>
        <span className={cn(
          'text-lg font-bold tracking-wide',
          selected === 'DOWN' ? 'text-down' : 'text-foreground'
        )}>
          DOWN
        </span>
        <span className="text-xs text-muted-foreground">Price will decrease</span>
      </button>
    </div>
  );
}
