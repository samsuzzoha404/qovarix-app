import { ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { PRODUCT } from '@/config/product';
import { QUBIC_CONFIG } from '@/config/constants';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border/60 bg-card/30 backdrop-blur-xl">
      <div className="container py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={theme === 'dark' ? '/Logo White.png' : '/Logo black.png'}
              alt="Qovarix"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-base text-muted-foreground font-medium">
            <span className="cursor-not-allowed opacity-70" title="Documentation coming in live integration">
              Documentation (Coming in live integration)
            </span>
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-all duration-300 hover:scale-105 flex items-center gap-1.5"
            >
              Base
              <ExternalLink className="h-4 w-4" />
            </a>
            <span className="cursor-not-allowed opacity-70" title="Support channel coming in live integration">
              Support (Coming in live integration)
            </span>
          </div>

          {/* Network badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-muted/60 border border-border/50">
            <div className="h-2.5 w-2.5 rounded-full bg-up animate-pulse shadow-lg shadow-up/50" />
            <span className="text-sm font-medium text-foreground">{QUBIC_CONFIG.networkLabel}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/60 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {PRODUCT.name}. {PRODUCT.copyrightSuffix}
        </div>
      </div>
    </footer>
  );
}
