import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: 'up' | 'down' | 'primary' | 'neutral';
  className?: string;
}

const accentClasses = {
  up: 'bg-up/8 border-up/15',
  down: 'bg-down/8 border-down/15',
  primary: 'bg-primary/8 border-primary/15',
  neutral: 'bg-muted/50 border-border/50',
};

const valueAccentClasses = {
  up: 'text-up',
  down: 'text-down',
  primary: 'text-primary',
  neutral: 'text-foreground',
};

export function MetricCard({
  label,
  value,
  sub,
  accent = 'neutral',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        accentClasses[accent],
        className
      )}
    >
      <div className="section-label mb-1.5">{label}</div>
      <div className={cn('metric-value text-2xl', valueAccentClasses[accent])}>
        {value}
      </div>
      {sub && (
        <div className="text-xs text-muted-foreground mt-1">{sub}</div>
      )}
    </div>
  );
}
