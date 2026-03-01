import { AppLayout } from '@/layouts/AppLayout';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getListingById } from '@/services/supabaseService';
import { MarketDataSource } from '@/components/analytics/MarketDataSource';

const ListingDetail = () => {
  const { id } = useParams();

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListingById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Loading listing…</p>
      </AppLayout>
    );
  }

  if (isError || !listing) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Listing not found.</p>
        <Link to="/marketplace" className="mt-2 text-sm text-primary hover:underline">Return to marketplace</Link>
      </AppLayout>
    );
  }

  const pricePosition =
    ((listing.price_per_unit - listing.market_low) / (listing.market_high - listing.market_low)) * 100;

  return (
    <AppLayout>
      <Link to="/marketplace" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to marketplace
      </Link>

      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Listing Detail</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
          {listing.produce} — {listing.variety}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Posted {new Date(listing.created_at).toLocaleDateString('en-ZW')} by {listing.farmer?.name ?? 'Farmer'}
        </p>
      </header>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Main info */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Produce Details</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Quantity', listing.remaining_quantity != null ? `${listing.remaining_quantity} ${listing.unit} remaining` : `${listing.quantity} ${listing.unit}`],
                ['Quality', listing.quality],
                ['Location', listing.location],
                ['Available', `${listing.available_from} → ${listing.available_until}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Market Price Context</h2>
            <div className="rounded border border-border p-4">
              <div className="mb-3 flex flex-col gap-1 text-sm sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-muted-foreground">30-day range for {listing.produce}</span>
                <span className="font-medium text-foreground">${listing.market_low.toFixed(2)} — ${listing.market_high.toFixed(2)} / kg</span>
              </div>
              <div className="relative h-2 rounded-full bg-muted">
                <div className="absolute top-0 h-2 w-full rounded-full bg-primary/20" />
                <div className="absolute top-0 h-2 w-0.5 bg-primary/40" style={{ left: `${((listing.market_median - listing.market_low) / (listing.market_high - listing.market_low)) * 100}%` }} />
                <div className="absolute -top-1 h-4 w-1 rounded-full bg-primary" style={{ left: `${Math.min(Math.max(pricePosition, 0), 100)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>${listing.market_low.toFixed(2)}</span>
                <span>Median: ${listing.market_median.toFixed(2)}</span>
                <span>${listing.market_high.toFixed(2)}</span>
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Ask price: ${listing.price_per_unit.toFixed(2)}/kg</span>
                  {' '}— {listing.price_per_unit < listing.market_median ? 'Below' : 'Above'} median
                  by ${Math.abs(listing.price_per_unit - listing.market_median).toFixed(2)}/kg
                </p>
              </div>
            </div>
            <div className="mt-4">
              <MarketDataSource />
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Historical Price References</h2>
            {/* Desktop */}
            <div className="hidden overflow-hidden rounded border border-border sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Avg Price/kg</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody>
                    {[
                    { period: 'Jan 2026', price: listing.market_median, vol: '12,400 kg' },
                    { period: 'Dec 2025', price: listing.market_median * 0.95, vol: '8,200 kg' },
                    { period: 'Nov 2025', price: listing.market_median * 0.88, vol: '15,600 kg' },
                    { period: 'Oct 2025', price: listing.market_median * 0.92, vol: '11,800 kg' },
                  ].map((row) => (
                    <tr key={row.period} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 text-foreground">{row.period}</td>
                      <td className="px-4 py-2 text-right font-medium text-foreground">${row.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{row.vol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="space-y-2 sm:hidden">
              {[
                { period: 'Jan 2026', price: listing.market_median, vol: '12,400 kg' },
                { period: 'Dec 2025', price: listing.market_median * 0.95, vol: '8,200 kg' },
                { period: 'Nov 2025', price: listing.market_median * 0.88, vol: '15,600 kg' },
                { period: 'Oct 2025', price: listing.market_median * 0.92, vol: '11,800 kg' },
              ].map((row) => (
                <div key={row.period} className="rounded border border-border p-3">
                  <p className="text-sm font-medium text-foreground">{row.period}</p>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg: ${row.price.toFixed(2)}/kg</span>
                    <span className="text-muted-foreground">{row.vol}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Farmer</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{listing.farmer?.name ?? 'Farmer'}</p>
              <p className="text-muted-foreground">{listing.location}</p>
              <div className="flex gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
                <span>{listing.farmer?.completed_transactions ?? 0} trades</span>
                <span>{listing.farmer?.rating ?? 0}★ rating</span>
              </div>
            </div>
            {listing.farmer && (
              <Link to={`/profile/${listing.farmer.id}`} className="mt-3 block text-xs font-medium text-primary hover:underline">
              View full profile
            </Link>
            )}
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Begin Negotiation</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Starting a negotiation sends your initial offer to the farmer.
              The system will provide price guidance based on market data.
            </p>
            <Link to={`/negotiation/new?listing=${listing.id}`} className="block w-full rounded bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Make an offer
            </Link>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default ListingDetail;
