import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AppFooter } from '@/components/navigation/AppFooter';
import { useIsMobile } from '@/hooks/use-mobile';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppSidebar />
      <main className={isMobile ? 'flex-1 pt-14' : 'ml-56 flex-1'}>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
      <div className={isMobile ? '' : 'ml-56'}>
        <AppFooter />
      </div>
    </div>
  );
};
