import { AppLayout } from '@/layouts/AppLayout';
import { listings } from '@/data/mock';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Listing not found.</p>
        <Link to="/marketplace" className="mt-2 text-sm text-primary hover:underline">
          Return to marketplace
        </Link>
      </AppLayout>
    );
  }

  const pricePosition =
    ((listing.pricePerUnit - listing.marketLow) / (listing.marketHigh - listing.marketLow)) * 100;

  return (
    <AppLayout>
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to marketplace
      </Link>

      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Listing Detail
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
          {listing.produce} — {listing.variety}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Posted {listing.createdAt} by {listing.farmer.name}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main info — 2 cols */}
        <div className="space-y-8 lg:col-span-2">
          {/* Details */}
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Produce Details
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Quantity</dt>
                <dd className="font-medium text-foreground">{listing.quantity} {listing.unit}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Quality</dt>
                <dd className="text-foreground">{listing.quality}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="text-foreground">{listing.location}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Available</dt>
                <dd className="text-foreground">{listing.availableFrom} → {listing.availableUntil}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {listing.description}
            </p>
          </section>

          {/* Market price context */}
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Market Price Context
            </h2>
            <div className="rounded border border-border p-4">
              <div className="mb-3 flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">30-day range for {listing.produce}</span>
                <span className="font-medium text-foreground">
                  ${listing.marketLow.toFixed(2)} — ${listing.marketHigh.toFixed(2)} / kg
                </span>
              </div>

              {/* Price bar */}
              <div className="relative h-2 rounded-full bg-muted">
                <div
                  className="absolute top-0 h-2 rounded-full bg-primary/20"
                  style={{ left: '0%', width: '100%' }}
                />
                {/* Median marker */}
                <div
                  className="absolute top-0 h-2 w-0.5 bg-primary/40"
                  style={{
                    left: `${((listing.marketMedian - listing.marketLow) / (listing.marketHigh - listing.marketLow)) * 100}%`,
                  }}
                />
                {/* Ask price marker */}
                <div
                  className="absolute -top-1 h-4 w-1 rounded-full bg-primary"
                  style={{ left: `${Math.min(Math.max(pricePosition, 0), 100)}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>${listing.marketLow.toFixed(2)}</span>
                <span>Median: ${listing.marketMedian.toFixed(2)}</span>
                <span>${listing.marketHigh.toFixed(2)}</span>
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Ask price: ${listing.pricePerUnit.toFixed(2)}/kg</span>
                  {' '}— {listing.pricePerUnit < listing.marketMedian ? 'Below' : 'Above'} median
                  by ${Math.abs(listing.pricePerUnit - listing.marketMedian).toFixed(2)}/kg
                  ({((Math.abs(listing.pricePerUnit - listing.marketMedian) / listing.marketMedian) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </section>

          {/* Historical references */}
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Historical Price References
            </h2>
            <div className="overflow-hidden rounded border border-border">
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
                    { period: 'Jan 2026', price: listing.marketMedian, vol: '12,400 kg' },
                    { period: 'Dec 2025', price: listing.marketMedian * 0.95, vol: '8,200 kg' },
                    { period: 'Nov 2025', price: listing.marketMedian * 0.88, vol: '15,600 kg' },
                    { period: 'Oct 2025', price: listing.marketMedian * 0.92, vol: '11,800 kg' },
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
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Farmer profile */}
          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Farmer</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{listing.farmer.name}</p>
              <p className="text-muted-foreground">{listing.location}</p>
              <div className="flex gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
                <span>{listing.farmer.transactions} trades</span>
                <span>{listing.farmer.rating}★ rating</span>
              </div>
            </div>
            <Link
              to={`/profile/${listing.farmer.id}`}
              className="mt-3 block text-xs font-medium text-primary hover:underline"
            >
              View full profile
            </Link>
          </section>

          {/* Action */}
          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Begin Negotiation
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Starting a negotiation sends your initial offer to the farmer.
              The system will provide price guidance based on market data.
            </p>
            <Link
              to={`/negotiation/new?listing=${listing.id}`}
              className="block w-full rounded bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Make an offer
            </Link>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default ListingDetail;
