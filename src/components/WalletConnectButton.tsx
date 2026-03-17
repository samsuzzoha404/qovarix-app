import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, AlertTriangle, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUBIC_CONFIG } from '@/config/constants';
import { UI_COPY } from '@/config/product';

interface WalletConnectButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showBalance?: boolean;
}

export function WalletConnectButton({
  className,
  variant = 'default',
  size = 'default',
  showBalance = false,
}: WalletConnectButtonProps) {
  const { connected, address, balance, connectDemoWallet, disconnect, isConnecting, error, isDemoMode } = useWallet();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleDemoConnect = async () => {
    setConnectError(null);
    try {
      await connectDemoWallet();
      setDialogOpen(false);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Failed to connect demo wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setConnectError(null);
    }
  };

  if (connected && address) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {isDemoMode && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <FlaskConical className="h-3 w-3 mr-1" />
            Demo
          </Badge>
        )}
        {showBalance && (
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground">{UI_COPY.balanceLabel}</div>
            <div className="text-sm font-mono font-medium">{balance.toLocaleString()} QVX</div>
          </div>
        )}
        <Button
          variant="outline"
          size={size}
          onClick={handleDisconnect}
          className="font-mono"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {formatAddress(address, 4)}
          <LogOut className="h-4 w-4 ml-2 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isConnecting}
          className={cn(
            variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
            className
          )}
        >
          {isConnecting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{UI_COPY.walletConnectTitle}</DialogTitle>
          <DialogDescription>
            {UI_COPY.walletConnectSubtext}
          </DialogDescription>
        </DialogHeader>

        {QUBIC_CONFIG.simulationMode ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2 mb-3">
                <FlaskConical className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">{UI_COPY.demoWalletTitle}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {UI_COPY.demoWalletDescription}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleDemoConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Start Demo
                  </>
                )}
              </Button>
            </div>

            {(connectError || error) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{connectError || error}</span>
              </div>
            )}
          </div>
        ) : (
          // Real wallet integration — available in a future release
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-center">
              <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Live Wallet Integration</p>
              <p className="text-xs text-muted-foreground mt-1">
                Real wallet connectivity is coming in a future release.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
