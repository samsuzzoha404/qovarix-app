import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon ?? <InboxIcon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
