import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

/** Standardized section header used inside cards and panels */
export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-5', className)}>
      <h3 className="section-label">{title}</h3>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
