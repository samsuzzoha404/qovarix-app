import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SkeletonMetric } from '@/components/ui/skeleton-card';

interface PriceDisplayProps {
  className?: string;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

export function PriceDisplay({ className, showChange = true, size = 'md' }: PriceDisplayProps) {
  const { data: price, isLoading } = useCurrentPrice();

  if (isLoading || !price) {
    return <SkeletonMetric className={className} />;
  }

  const isPositive = price.change24h >= 0;

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <div className="section-label">QVX / USD</div>
      <div className={cn('metric-value', sizeClasses[size])}>
        ${formatNumber(price.price)}
      </div>
      {showChange && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            isPositive
              ? 'bg-up/10 text-up'
              : 'bg-down/10 text-down'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {formatPercentage(price.change24h)} 24h
        </div>
      )}
    </div>
  );
}
