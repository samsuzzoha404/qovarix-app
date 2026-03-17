import { cn } from '@/lib/utils';
import { AISignal } from '@/types';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { ArrowUp, ArrowDown, BrainCircuit, AlertTriangle } from 'lucide-react';

interface AISignalCardProps {
  signal: AISignal | null | undefined;
  isLoading?: boolean;
  className?: string;
}

export function AISignalCard({ signal, isLoading, className }: AISignalCardProps) {
  return (
    <GlassCard className={cn('p-5', className)}>
      <SectionHeader
        title="AI Signal"
        action={<BrainCircuit className="h-4 w-4 text-muted-foreground" />}
      />

      {isLoading ? (
        <SkeletonCard rows={2} className="p-0" />
      ) : !signal ? (
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">No signal available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Direction + confidence */}
          <div className="flex items-center justify-between">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm',
              signal.direction === 'UP'
                ? 'bg-up/10 text-up border-up/20'
                : 'bg-down/10 text-down border-down/20'
            )}>
              {signal.direction === 'UP'
                ? <ArrowUp className="h-4 w-4" />
                : <ArrowDown className="h-4 w-4" />}
              {signal.direction}
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Confidence</div>
              <div className={cn(
                'metric-value text-base',
                signal.confidence >= 0.7 ? 'text-up' : signal.confidence >= 0.5 ? 'text-warning' : 'text-muted-foreground'
              )}>
                {(signal.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                signal.confidence >= 0.7 ? 'bg-up' : signal.confidence >= 0.5 ? 'bg-warning' : 'bg-muted-foreground'
              )}
              style={{ width: `${signal.confidence * 100}%` }}
            />
          </div>

          {/* Reasoning */}
          {signal.reasoning && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {signal.reasoning}
            </p>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-1.5 pt-1 border-t border-border/40">
            <AlertTriangle className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Advisory only. Not investment advice.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
