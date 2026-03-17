import { cn } from '@/lib/utils';
import { Round } from '@/types';
import { Clock, Zap, CheckCircle2, Loader2 } from 'lucide-react';

interface RoundStatusBadgeProps {
  round: Round | undefined;
  ticksRemaining?: number;
  className?: string;
}

type RoundPhase = 'open' | 'locking' | 'settling' | 'resolved' | 'loading';

function getRoundPhase(round: Round | undefined, ticksRemaining: number): RoundPhase {
  if (!round) return 'loading';
  if (round.status === 'completed' || round.status === 'resolved') return 'resolved';
  if (ticksRemaining <= 0) return 'settling';
  if (ticksRemaining <= 5) return 'locking';
  return 'open';
}

const phaseConfig: Record<RoundPhase, {
  label: string;
  icon: React.ElementType;
  classes: string;
  pulse?: boolean;
}> = {
  open: {
    label: 'Round Open',
    icon: Zap,
    classes: 'bg-up/10 text-up border-up/20',
    pulse: true,
  },
  locking: {
    label: 'Locking Soon',
    icon: Clock,
    classes: 'bg-warning/10 text-warning border-warning/20',
    pulse: true,
  },
  settling: {
    label: 'Settling',
    icon: Loader2,
    classes: 'bg-primary/10 text-primary border-primary/20',
    pulse: true,
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    classes: 'bg-muted text-muted-foreground border-border/50',
  },
  loading: {
    label: 'Loading',
    icon: Loader2,
    classes: 'bg-muted text-muted-foreground border-border/50',
  },
};

export function RoundStatusBadge({ round, ticksRemaining = 30, className }: RoundStatusBadgeProps) {
  const phase = getRoundPhase(round, ticksRemaining);
  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.classes,
        className
      )}
    >
      {config.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      ) : (
        <Icon className={cn('h-3 w-3', phase === 'settling' || phase === 'loading' ? 'animate-spin' : '')} />
      )}
      {config.label}
    </span>
  );
}

export { getRoundPhase };
export type { RoundPhase };
