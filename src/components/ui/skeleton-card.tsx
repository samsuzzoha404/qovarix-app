import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  rows?: number;
  className?: string;
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn('h-3 rounded bg-muted animate-pulse', className)} />
  );
}

export function SkeletonCard({ rows = 3, className }: SkeletonCardProps) {
  return (
    <div className={cn('space-y-3 p-4', className)}>
      <SkeletonLine className="w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} className={i % 2 === 0 ? 'w-full' : 'w-4/5'} />
      ))}
    </div>
  );
}

/** Single skeleton line — for inline loading placeholders */
export function SkeletonLine2({ className }: { className?: string }) {
  return <div className={cn('h-3 rounded bg-muted animate-pulse', className)} />;
}

/** Skeleton for a metric value */
export function SkeletonMetric({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
      <div className="h-7 w-28 rounded bg-muted animate-pulse" />
    </div>
  );
}
