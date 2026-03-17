import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { Shield, CheckCircle2 } from 'lucide-react';

interface FairnessCardProps {
  className?: string;
}

const FAIRNESS_POINTS = [
  'Non-custodial design — funds stay on-chain',
  'Round outcomes determined by on-chain price feeds',
  'All round data is publicly verifiable',
  'Protocol fee: 2% — no hidden charges',
];

export function FairnessCard({ className }: FairnessCardProps) {
  return (
    <GlassCard className={cn('p-5', className)}>
      <SectionHeader
        title="Transparency"
        action={<Shield className="h-4 w-4 text-muted-foreground" />}
      />
      <div className="space-y-2">
        {FAIRNESS_POINTS.map((point) => (
          <div key={point} className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-up shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground leading-relaxed">{point}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
