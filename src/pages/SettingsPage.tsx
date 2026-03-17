import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ResetDemoButton } from '@/components/ResetDemoButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallet } from '@/hooks/useWallet';
import { Moon, Sun, Globe, Shield, Bell, FlaskConical, Radio, Lock } from 'lucide-react';
import { QUBIC_CONFIG } from '@/config/constants';
import { PRODUCT, CURRENT_APP_MODE, APP_MODE_META, AppMode } from '@/config/product';
import { cn } from '@/lib/utils';

const MODE_ORDER = [AppMode.Demo, AppMode.Testnet, AppMode.Live] as const;

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode } = useWallet();

  return (
    <MainLayout>
      <div className="container py-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Settings</h1>

        <div className="space-y-8">
          {/* App Mode */}
          <GlassCard className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">App Mode</h2>
            </div>

            <div className="space-y-3">
              {MODE_ORDER.map((mode) => {
                const meta = APP_MODE_META[mode];
                const isActive = CURRENT_APP_MODE === mode;
                return (
                  <div
                    key={mode}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-colors",
                      isActive
                        ? "bg-primary/5 border-primary/30"
                        : "bg-muted/30 border-border/50 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isActive ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-up animate-pulse" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">{meta.label}</div>
                        <div className="text-sm text-muted-foreground">{meta.description}</div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-semibold",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : meta.available
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground"
                    )}>
                      {isActive ? 'Active' : meta.available ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Demo Mode Controls (shown only in demo) */}
          {QUBIC_CONFIG.simulationMode && isDemoMode && (
            <GlassCard className="p-8 border-primary/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FlaskConical className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Demo Controls</h2>
              </div>

              <div className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {APP_MODE_META[AppMode.Demo].description} All trades and balances are local to your browser.
                </p>

                <div className="flex items-center justify-between p-6 rounded-xl bg-muted/60 border border-border/50">
                  <div>
                    <div className="font-medium">Reset Demo Session</div>
                    <div className="text-sm text-muted-foreground">
                      Clear all demo trade history and restore starting balance
                    </div>
                  </div>
                  <ResetDemoButton />
                </div>
              </div>
            </GlassCard>
          )}

          {/* Appearance */}
          <GlassCard className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
              </div>
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-lg font-semibold">
                  Dark Mode
                </Label>
                <p className="text-base text-muted-foreground mt-1">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </GlassCard>

          {/* Network */}
          <GlassCard className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Network</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 rounded-xl bg-muted/60 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-up animate-pulse" />
                  <div>
                    <div className="font-medium">{QUBIC_CONFIG.networkLabel}</div>
                    <div className="text-sm text-muted-foreground">Demo simulation active</div>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Active
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {PRODUCT.name} is built for {PRODUCT.chain} mainnet. Live trading launches after audit completion. Demo mode uses simulated data.
              </p>
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="mb-4 text-xs font-medium text-muted-foreground">
              Coming in live integration
            </div>

            <div className="space-y-6 opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="round-alerts" className="text-lg font-semibold">
                    Round Alerts
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Get notified when rounds end
                  </p>
                </div>
                <Switch id="round-alerts" disabled aria-disabled="true" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="win-alerts" className="text-lg font-semibold">
                    Win Notifications
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Get notified when you win a round
                  </p>
                </div>
                <Switch id="win-alerts" checked={false} disabled aria-disabled="true" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound" className="text-lg font-semibold">
                    Sound Effects
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Play sounds for trade actions
                  </p>
                </div>
                <Switch id="sound" disabled aria-disabled="true" />
              </div>
            </div>
          </GlassCard>

          {/* Security */}
          <GlassCard className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <div className="mb-4 text-xs font-medium text-muted-foreground">
              Coming in live integration
            </div>

            <div className="space-y-6 opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirm-bets" className="text-lg font-semibold">
                    Confirm Large Trades
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Require confirmation for trades over 500 QVX trading balance
                  </p>
                </div>
                <Switch id="confirm-bets" checked={false} disabled aria-disabled="true" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-disconnect" className="text-lg font-semibold">
                    Auto-Disconnect
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Disconnect wallet after 30 minutes of inactivity
                  </p>
                </div>
                <Switch id="auto-disconnect" disabled aria-disabled="true" />
              </div>
            </div>
          </GlassCard>

          {/* Language */}
          <GlassCard className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Language</h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇺🇸</span>
                <div>
                  <div className="font-medium">English</div>
                  <div className="text-sm text-muted-foreground">United States</div>
                </div>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Selected
              </span>
            </div>

            <p className="text-base text-muted-foreground mt-6 leading-relaxed">
              More languages coming in live integration.
            </p>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
