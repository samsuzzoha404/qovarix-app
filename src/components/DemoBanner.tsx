import { FlaskConical } from 'lucide-react';
import { CURRENT_APP_MODE, APP_MODE_META, AppMode } from '@/config/product';
import { useWallet } from '@/hooks/useWallet';
import { QUBIC_CONFIG } from '@/config/constants';

export function DemoBanner() {
  const { isDemoMode } = useWallet();

  if (!QUBIC_CONFIG.simulationMode || !isDemoMode) {
    return null;
  }

  const meta = APP_MODE_META[AppMode.Demo];

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 px-4 py-2">
      <div className="container max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-sm">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/25">
          <FlaskConical className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary font-semibold text-xs tracking-wide uppercase">
            {APP_MODE_META[CURRENT_APP_MODE].badge}
          </span>
        </div>
        <span className="text-muted-foreground">{meta.description}</span>
      </div>
    </div>
  );
}
