import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/status-badge';
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

function SettingsSectionIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="p-2 rounded-lg bg-primary/8 border border-primary/15">
      <Icon className="h-4 w-4 text-primary" />
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode } = useWallet();

  return (
    <MainLayout>
      <div className="container py-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
        </div>

        <div className="space-y-5">
          {/* App Mode */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <SettingsSectionIcon icon={Radio} />
              <h2 className="text-base font-semibold">App Mode</h2>
            </div>

            <div className="space-y-2">
              {MODE_ORDER.map((mode) => {
                const meta = APP_MODE_META[mode];
                const isActive = CURRENT_APP_MODE === mode;
                return (
                  <div
                    key={mode}
                    className={cn(
                      'flex items-center justify-between p-3.5 rounded-lg border transition-colors',
                      isActive
                        ? 'bg-primary/5 border-primary/25'
                        : 'bg-muted/20 border-border/40 opacity-55'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isActive ? (
                        <span className="h-2 w-2 rounded-full bg-up animate-pulse shrink-0" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{meta.label}</div>
                        <div className="text-xs text-muted-foreground">{meta.description}</div>
                      </div>
                    </div>
                    <StatusBadge
                      variant={isActive ? 'active' : meta.available ? 'inactive' : 'coming-soon'}
                      label={isActive ? 'Active' : meta.available ? 'Available' : 'Coming Soon'}
                      pulse={isActive}
                    />
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Demo Controls */}
          {QUBIC_CONFIG.simulationMode && isDemoMode && (
            <GlassCard className="p-5 border-primary/20">
              <div className="flex items-center gap-3 mb-5">
                <SettingsSectionIcon icon={FlaskConical} />
                <h2 className="text-base font-semibold">Demo Controls</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {APP_MODE_META[AppMode.Demo].description} All trades and balances are local to your browser.
              </p>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border/50">
                <div>
                  <div className="text-sm font-medium">Reset Demo Session</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Clear all demo trade history and restore starting balance
                  </div>
                </div>
                <ResetDemoButton />
              </div>
            </GlassCard>
          )}

          {/* Appearance */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <SettingsSectionIcon icon={theme === 'dark' ? Moon : Sun} />
              <h2 className="text-base font-semibold">Appearance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
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
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <SettingsSectionIcon icon={Globe} />
              <h2 className="text-base font-semibold">Network</h2>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/50 mb-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-up animate-pulse shrink-0" />
                <div>
                  <div className="text-sm font-medium">{QUBIC_CONFIG.networkLabel}</div>
                  <div className="text-xs text-muted-foreground">Demo simulation active</div>
                </div>
              </div>
              <StatusBadge variant="active" label="Active" pulse />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {PRODUCT.name} is built for {PRODUCT.chain} mainnet. Live trading launches after audit completion.
            </p>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <SettingsSectionIcon icon={Bell} />
              <h2 className="text-base font-semibold">Notifications</h2>
            </div>

            <div className="mb-4">
              <StatusBadge variant="coming-soon" label="Coming in live integration" />
            </div>

            <div className="space-y-4 opacity-60 pointer-events-none select-none">
              {[
                { id: 'round-alerts', label: 'Round Alerts', desc: 'Get notified when rounds end' },
                { id: 'win-alerts', label: 'Win Notifications', desc: 'Get notified when you win a round' },
                { id: 'sound', label: 'Sound Effects', desc: 'Play sounds for trade actions' },
              ].map(({ id, label, desc }) => (
                <div key={id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <Switch id={id} disabled aria-disabled="true" />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Security */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <SettingsSectionIcon icon={Shield} />
              <h2 className="text-base font-semibold">Security</h2>
            </div>

            <div className="mb-4">
              <StatusBadge variant="coming-soon" label="Coming in live integration" />
            </div>

            <div className="space-y-4 opacity-60 pointer-events-none select-none">
              {[
                { id: 'confirm-bets', label: 'Confirm Large Trades', desc: 'Require confirmation for trades over 500 QVX' },
                { id: 'auto-disconnect', label: 'Auto-Disconnect', desc: 'Disconnect wallet after 30 minutes of inactivity' },
              ].map(({ id, label, desc }) => (
                <div key={id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <Switch id={id} disabled aria-disabled="true" />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Language */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <SettingsSectionIcon icon={Globe} />
              <h2 className="text-base font-semibold">Language</h2>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/50">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇺🇸</span>
                <div>
                  <div className="text-sm font-medium">English</div>
                  <div className="text-xs text-muted-foreground">United States</div>
                </div>
              </div>
              <StatusBadge variant="active" label="Selected" />
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              More languages coming in live integration.
            </p>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
