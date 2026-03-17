import { Link } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatNumber, formatAddress } from '@/lib/utils';
import { QUBIC_CONFIG } from '@/config/constants';
import { CURRENT_APP_MODE, APP_MODE_META } from '@/config/product';
import { ROUTES } from '@/config/constants';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardTopBarProps {
  className?: string;
}

export function DashboardTopBar({ className }: DashboardTopBarProps) {
  const { connected, address, balance } = useWallet();
  const { data: price } = useCurrentPrice();

  const modeMeta = APP_MODE_META[CURRENT_APP_MODE];
  const isPositive = price ? price.change24h >= 0 : true;

  return (
    <div className={cn(
      'w-full border-b border-border/40 bg-card/40 backdrop-blur-sm',
      className
    )}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-10 gap-4 overflow-x-auto no-scrollbar">
          {/* Left: market ticker */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">QVX/USD</span>
              {price && (
                <>
                  <span className="metric-value text-xs">${price.price.toFixed(2)}</span>
                  <span className={cn(
                    'flex items-center gap-0.5 text-[10px] font-medium',
                    isPositive ? 'text-up' : 'text-down'
                  )}>
                    {isPositive
                      ? <TrendingUp className="h-3 w-3" />
                      : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? '+' : ''}{price.change24h.toFixed(2)}%
                  </span>
                </>
              )}
            </div>

            <div className="h-3 w-px bg-border/60" />

            {/* Network */}
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
              <span className="text-[10px] text-muted-foreground">{QUBIC_CONFIG.networkLabel}</span>
            </div>

            <div className="h-3 w-px bg-border/60" />

            {/* Mode */}
            <StatusBadge
              variant="active"
              label={modeMeta.badge}
              size="sm"
              pulse
            />
          </div>

          {/* Right: wallet context */}
          <div className="flex items-center gap-3 shrink-0">
            {connected && address ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Wallet className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatAddress(address, 4)}
                  </span>
                </div>
                <div className="h-3 w-px bg-border/60 hidden sm:block" />
                <Link to={ROUTES.wallet} className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Balance</span>
                  <span className="metric-value text-xs text-primary">
                    {formatNumber(balance)} QVX
                  </span>
                </Link>
              </>
            ) : (
              <WalletConnectButton size="sm" variant="ghost" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
