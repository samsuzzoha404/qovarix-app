import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { DemoBanner } from '@/components/DemoBanner';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-grid">
      <Header />
      <DemoBanner />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
