import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { useTheme } from '@/contexts/ThemeContext';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { formatAddress, formatNumber } from '@/lib/utils';
import {
  Wallet,
  Moon,
  Sun,
  Menu,
  X,
  LayoutDashboard,
  Target,
  History,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/config/constants';

const navItems = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Trade', path: ROUTES.bet, icon: Target },
  { label: 'History', path: ROUTES.history, icon: History },
  { label: 'Wallet', path: ROUTES.wallet, icon: Wallet },
  { label: 'Settings', path: ROUTES.settings, icon: Settings },
];

export function Header() {
  const location = useLocation();
  const { connected, address, balance, disconnect } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img
              src={theme === 'dark' ? '/Logo White.png' : '/Logo black.png'}
              alt="Qovarix"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                location.pathname === item.path
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Wallet */}
          {connected ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right px-4 py-2 rounded-lg bg-muted/50">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trading Balance</div>
                <div className="text-base font-mono font-semibold text-foreground">{formatNumber(balance)} <span className="text-primary">QVX</span></div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="font-mono font-semibold hover:bg-muted/80 transition-all"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {formatAddress(address || '', 4)}
              </Button>
            </div>
          ) : (
            <WalletConnectButton size="sm" />
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
