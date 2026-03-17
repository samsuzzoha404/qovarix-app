import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { BetDirection } from '@/types';

interface ResultBadgeProps {
  direction: BetDirection | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-1.5',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export function ResultBadge({ direction, size = 'md', className }: ResultBadgeProps) {
  if (!direction) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-muted text-muted-foreground border border-border/50',
          sizeClasses[size],
          className
        )}
      >
        <Clock className={iconSizes[size]} />
        Pending
      </span>
    );
  }

  const isUp = direction === 'UP';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        isUp
          ? 'bg-up/10 text-up border border-up/20'
          : 'bg-down/10 text-down border border-down/20',
        sizeClasses[size],
        className
      )}
    >
      {isUp ? (
        <ArrowUp className={iconSizes[size]} />
      ) : (
        <ArrowDown className={iconSizes[size]} />
      )}
      {direction}
    </span>
  );
}
