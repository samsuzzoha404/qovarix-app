import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ResetDemoButton } from '@/components/ResetDemoButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallet } from '@/hooks/useWallet';
import { Moon, Sun, Globe, Shield, Bell, Zap } from 'lucide-react';
import { QUBIC_CONFIG } from '@/config/constants';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode } = useWallet();

  return (
    <MainLayout>
      <div className="container py-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Settings</h1>

        <div className="space-y-8">
          {/* Demo Mode Settings */}
          {QUBIC_CONFIG.simulationMode && isDemoMode && (
            <GlassCard className="p-8 border-primary/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Demo Mode</h2>
              </div>

              <div className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  You're currently using a demo wallet with simulated funds. 
                  All transactions and bets are simulated. Your data is saved locally in your browser.
                </p>
                
                <div className="flex items-center justify-between p-6 rounded-xl bg-muted/60 border border-border/50">
                  <div>
                    <div className="font-medium">Reset Demo Data</div>
                    <div className="text-sm text-muted-foreground">
                      Clear all demo wallet history and start fresh
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
                    <div className="font-medium">Surge Testnet</div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Active
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Qovarix currently operates on Surge Testnet. Mainnet support coming soon.
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

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="round-alerts" className="text-lg font-semibold">
                    Round Alerts
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Get notified when rounds end
                  </p>
                </div>
                <Switch id="round-alerts" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="win-alerts" className="text-lg font-semibold">
                    Win Notifications
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Celebrate when you win
                  </p>
                </div>
                <Switch id="win-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound" className="text-lg font-semibold">
                    Sound Effects
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Play sounds for actions
                  </p>
                </div>
                <Switch id="sound" />
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

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirm-bets" className="text-lg font-semibold">
                    Confirm Large Bets
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    Require confirmation for bets over 500 QVX
                  </p>
                </div>
                <Switch id="confirm-bets" defaultChecked />
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
                <Switch id="auto-disconnect" />
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
              More languages coming soon.
            </p>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
