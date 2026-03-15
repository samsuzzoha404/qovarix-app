import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceDisplayProps {
  className?: string;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ className, showChange = true, size = 'md' }: PriceDisplayProps) {
  const { data: price, isLoading } = useCurrentPrice();

  if (isLoading || !price) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-8 w-32 bg-muted rounded" />
      </div>
    );
  }

  const isPositive = price.change24h >= 0;

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        QVX/USD Price
      </div>
      <div className={cn("font-mono font-bold", sizeClasses[size])}>
        ${formatNumber(price.price)}
      </div>
      {showChange && (
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositive ? "text-up" : "text-down"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {formatPercentage(price.change24h)}
        </div>
      )}
    </div>
  );
}
