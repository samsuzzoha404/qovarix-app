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
import { Wallet, LogOut, FlaskConical, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const { connected, address, balance, connectDemoWallet, disconnect, isConnecting, isDemoMode } = useWallet();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDemoConnect = async () => {
    try {
      await connectDemoWallet();
      setDialogOpen(false);
    } catch {
      // Error feedback is handled centrally by useWallet toasts.
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
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

        <div className="space-y-4 py-2">
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

          <div className="p-4 rounded-lg border border-border/60 bg-muted/40">
            <div className="flex items-start gap-2 mb-3">
              <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Live Wallet</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Coming in live integration.
                </p>
              </div>
            </div>
            <Button disabled variant="outline" className="w-full cursor-not-allowed opacity-60">
              Live Wallet Coming Soon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
