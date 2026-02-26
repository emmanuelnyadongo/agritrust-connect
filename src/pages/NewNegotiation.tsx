import { AppLayout } from '@/layouts/AppLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getListingById, createNegotiation } from '@/services/supabaseService';
import { computeSystemGuidance } from '@/utils/negotiationGuidance';
import { useAuth } from '@/hooks/useAuth';

const useQueryParam = (key: string) => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(key), [search, key]);
};

const NewNegotiation = () => {
  const listingId = useQueryParam('listing');
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!listingId) {
      navigate('/marketplace', { replace: true });
    }
  }, [listingId, navigate]);

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListingById(listingId as string),
    enabled: !!listingId,
  });

  const mutation = useMutation({
    mutationFn: (vars: { listingId: string; buyerId: string; systemGuidance: number }) =>
      createNegotiation(vars),
    onSuccess: (negotiation: any) => {
      queryClient.invalidateQueries({ queryKey: ['negotiations'] });
      navigate(`/negotiation/${negotiation.id}`, { replace: true });
    },
  });

  const handleStart = async () => {
    if (!listing || !user || submitting) return;
    setSubmitting(true);
    try {
      const guidance = computeSystemGuidance({
        marketLow: listing.market_low,
        marketHigh: listing.market_high,
        marketMedian: listing.market_median,
      });
      await mutation.mutateAsync({
        listingId: listing.id,
        buyerId: user.id,
        systemGuidance: guidance,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Negotiation
        </p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Start Negotiation
        </h1>
      </header>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading listing details…</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Unable to load listing. Please return to the marketplace and try again.
        </p>
      )}

      {listing && (
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            <div>
              <h2 className="mb-2 font-heading text-sm font-semibold text-foreground">
                Listing
              </h2>
              <p className="text-sm font-medium text-foreground">
                {listing.produce} — {listing.variety}
              </p>
              <p className="text-xs text-muted-foreground">
                {listing.quantity} {listing.unit} · {listing.location}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-heading text-sm font-semibold text-foreground">
                Market Context
              </h3>
              <p className="text-sm text-muted-foreground">
                30-day range: ${listing.market_low.toFixed(2)} – $
                {listing.market_high.toFixed(2)} / kg · Median $
                {listing.market_median.toFixed(2)}/kg
              </p>
            </div>
          </section>

          <section className="space-y-4 rounded border border-border p-4">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Confirm and Start
            </h2>
            <p className="text-xs text-muted-foreground">
              Starting a negotiation will share your interest with the farmer and create a
              negotiation room. You can then submit your first offer with full price
              guidance.
            </p>
            <button
              type="button"
              onClick={handleStart}
              disabled={submitting || !user}
              className="w-full rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? 'Creating negotiation…' : 'Start negotiation'}
            </button>
          </section>
        </div>
      )}
    </AppLayout>
  );
};

export default NewNegotiation;

