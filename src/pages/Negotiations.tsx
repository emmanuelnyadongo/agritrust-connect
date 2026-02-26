import { AppLayout } from '@/layouts/AppLayout';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getNegotiationsForUser } from '@/services/supabaseService';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';

const Negotiations = () => {
  const { role } = useRole();
  const { user } = useAuth();

  const {
    data: negotiations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['negotiations', { userId: user?.id, role }],
    queryFn: () => getNegotiationsForUser(user!.id, role),
    enabled: !!user,
  });

  return (
    <AppLayout>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Negotiations</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">Active Negotiations</h1>
      </header>

      {isLoading && (
        <p className="mb-4 text-sm text-muted-foreground">Loading negotiations…</p>
      )}

      {isError && (
        <p className="mb-4 text-sm text-destructive">
          Unable to load negotiations. Please refresh the page.
        </p>
      )}

      <div className="space-y-2">
        {negotiations.map((neg: any) => (
          <Link key={neg.id} to={`/negotiation/${neg.id}`} className="flex items-center justify-between rounded border border-border px-3 py-3 transition-colors hover:bg-muted/50 sm:px-5 sm:py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {neg.listing?.produce} — {neg.listing?.quantity} {neg.listing?.unit}
              </p>
              <p className="text-xs text-muted-foreground">
                {neg.listing?.farmer?.name ?? 'Farmer'} ↔ {neg.buyer?.name ?? 'Buyer'}
              </p>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-3 sm:gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Guidance: ${neg.system_guidance?.toFixed(2) ?? '0.00'}/kg
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {negotiations.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">No active negotiations.</p>
      )}
    </AppLayout>
  );
};

export default Negotiations;
