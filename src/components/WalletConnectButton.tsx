import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUBIC_CONFIG } from '@/config/constants';

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
  const { connected, address, balance, connect, connectDemoWallet, disconnect, isConnecting, error, isDemoMode } = useWallet();
  const [seed, setSeed] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!seed.trim()) {
      setConnectError('Please enter your seed phrase');
      return;
    }

    if (seed.length < 55) {
      setConnectError('Seed must be at least 55 characters');
      return;
    }

    setConnectError(null);
    try {
      await connect(seed);
      setSeed('');
      setDialogOpen(false);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

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
      setSeed('');
      setConnectError(null);
    }
  };

  if (connected && address) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {isDemoMode && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Zap className="h-3 w-3 mr-1" />
            Demo
          </Badge>
        )}
        {showBalance && (
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground">Balance</div>
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
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            {QUBIC_CONFIG.simulationMode ?
              'Try the demo wallet or connect with your real Surge wallet.' :
              'Enter your Surge seed phrase to connect your wallet.'
            }
          </DialogDescription>
        </DialogHeader>

        {QUBIC_CONFIG.simulationMode ? (
          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo Wallet</TabsTrigger>
              <TabsTrigger value="real">Real Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2 mb-3">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Demo Wallet</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Instant access with 10,000 QVX. Perfect for trying out the platform.
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
                    <Zap className="h-4 w-4 mr-2" />
                    Connect Demo Wallet
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
          </TabsContent>

          <TabsContent value="real" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your 55+ character seed phrase"
                value={seed}
                onChange={(e) => {
                  setSeed(e.target.value);
                  setConnectError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isConnecting) {
                    handleConnect();
                  }
                }}
                disabled={isConnecting}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your seed phrase is never sent to any server. It stays in your browser.
              </p>
            </div>

            {(connectError || error) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{connectError || error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isConnecting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !seed.trim()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isConnecting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </TabsContent>
          </Tabs>
        ) : (
          // Real wallet only mode (when simulationMode is false)
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your 55+ character seed phrase"
                value={seed}
                onChange={(e) => {
                  setSeed(e.target.value);
                  setConnectError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isConnecting) {
                    handleConnect();
                  }
                }}
                disabled={isConnecting}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your seed phrase is never sent to any server. It stays in your browser.
              </p>
            </div>

            {(connectError || error) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{connectError || error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isConnecting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !seed.trim()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isConnecting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
