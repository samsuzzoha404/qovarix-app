import { GlassCard } from '@/components/ui/glass-card';
import { SkeletonCard, SkeletonMetric } from '@/components/ui/skeleton-card';

/** Full dashboard loading skeleton — 3-column layout */
export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_280px] gap-5">
      {/* Left: market panel */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/50">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 divide-x divide-border/50">
          <div className="py-8 px-4 flex flex-col items-center gap-3">
            <SkeletonMetric />
          </div>
          <div className="py-8 px-4 flex flex-col items-center gap-3">
            <SkeletonMetric />
          </div>
        </div>
        <div className="px-4 pb-4 pt-3 border-t border-border/40">
          <div className="h-36 bg-muted/30 rounded-lg animate-pulse" />
        </div>
      </GlassCard>

      {/* Center: trading panel */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/50">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
        <SkeletonCard rows={5} className="p-5" />
      </GlassCard>

      {/* Right: intel panel */}
      <div className="space-y-4">
        <GlassCard className="p-5">
          <SkeletonCard rows={3} className="p-0" />
        </GlassCard>
        <GlassCard className="p-5">
          <SkeletonCard rows={4} className="p-0" />
        </GlassCard>
      </div>
    </div>
  );
}
