import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus, Clock, CheckCircle2, XCircle, AlertTriangle, Wifi } from 'lucide-react';

type StatusVariant =
  | 'up'
  | 'down'
  | 'pending'
  | 'success'
  | 'error'
  | 'warning'
  | 'active'
  | 'inactive'
  | 'coming-soon';

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

const variantConfig: Record<
  StatusVariant,
  { base: string; icon: React.ElementType | null; defaultLabel: string }
> = {
  up: {
    base: 'bg-up/10 text-up border border-up/20',
    icon: ArrowUp,
    defaultLabel: 'UP',
  },
  down: {
    base: 'bg-down/10 text-down border border-down/20',
    icon: ArrowDown,
    defaultLabel: 'DOWN',
  },
  pending: {
    base: 'bg-muted text-muted-foreground border border-border/50',
    icon: Clock,
    defaultLabel: 'Pending',
  },
  success: {
    base: 'bg-success/10 text-success border border-success/20',
    icon: CheckCircle2,
    defaultLabel: 'Success',
  },
  error: {
    base: 'bg-destructive/10 text-destructive border border-destructive/20',
    icon: XCircle,
    defaultLabel: 'Error',
  },
  warning: {
    base: 'bg-warning/10 text-warning border border-warning/20',
    icon: AlertTriangle,
    defaultLabel: 'Warning',
  },
  active: {
    base: 'bg-primary/10 text-primary border border-primary/20',
    icon: Wifi,
    defaultLabel: 'Active',
  },
  inactive: {
    base: 'bg-muted text-muted-foreground border border-border/50',
    icon: null,
    defaultLabel: 'Inactive',
  },
  'coming-soon': {
    base: 'bg-muted/60 text-muted-foreground border border-border/40',
    icon: null,
    defaultLabel: 'Coming Soon',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
};

export function StatusBadge({
  variant,
  label,
  size = 'sm',
  pulse = false,
  className,
}: StatusBadgeProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.base,
        sizeClasses[size],
        className
      )}
    >
      {pulse ? (
        <span className={cn('rounded-full bg-current animate-pulse', iconSizes[size])} />
      ) : Icon ? (
        <Icon className={iconSizes[size]} />
      ) : null}
      {displayLabel}
    </span>
  );
}
