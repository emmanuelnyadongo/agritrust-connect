import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className={isMobile ? 'min-h-screen pt-14' : 'ml-56 min-h-screen'}>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
