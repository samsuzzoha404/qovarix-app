import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type GlowVariant = 'up' | 'down' | 'primary' | 'none';
type CardVariant = 'glass' | 'surface' | 'flat';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: GlowVariant;
  /** 'glass' = glassmorphism (default), 'surface' = solid muted surface, 'flat' = no background */
  variant?: CardVariant;
}

const glowClasses: Record<GlowVariant, string> = {
  up: 'glow-up',
  down: 'glow-down',
  primary: 'glow-primary',
  none: '',
};

const variantClasses: Record<CardVariant, string> = {
  glass: 'glass-card',
  surface: 'bg-muted/50 border border-border/60 rounded-xl',
  flat: 'rounded-xl',
};

export function GlassCard({
  children,
  className,
  hover = false,
  glow = 'none',
  variant = 'glass',
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        'p-4 transition-all duration-200',
        hover && 'hover:scale-[1.015] hover:shadow-lg hover:border-primary/40 cursor-pointer',
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}
