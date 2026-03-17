import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Inline error banner — for form-level or section-level errors */
export function ErrorBanner({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/8 border border-destructive/20 text-destructive text-sm',
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
