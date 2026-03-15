import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RotateCcw } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { QUBIC_CONFIG } from '@/config/constants';

export function ResetDemoButton() {
  const { isDemoMode, disconnectWallet } = useWallet();

  if (!QUBIC_CONFIG.simulationMode || !isDemoMode) {
    return null;
  }

  const handleReset = () => {
    // Clear all demo data
    localStorage.removeItem('qubic_demo_balance');
    localStorage.removeItem('qubic_demo_bets');
    localStorage.removeItem('qubic_demo_price');
    localStorage.removeItem('qubic_demo_price_history');
    localStorage.removeItem('qubic_demo_round_prices');
    
    // Disconnect and reload
    disconnectWallet();
    window.location.reload();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset Demo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Demo Data?</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear your demo wallet balance, bet history, and all simulated data. 
            You'll get a fresh start with 10,000 QVX. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>
            Reset Everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
