import { AppLayout } from '@/layouts/AppLayout';
import { listings } from '@/data/mock';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Search } from 'lucide-react';

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  const locations = ['all', ...new Set(listings.map((l) => l.location))];

  const filtered = listings.filter((l) => {
    const matchesSearch =
      l.produce.toLowerCase().includes(search.toLowerCase()) ||
      l.variety.toLowerCase().includes(search.toLowerCase()) ||
      l.farmer.name.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === 'all' || l.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <AppLayout>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Marketplace
        </p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Available Produce
        </h1>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search produce, variety, or farmer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                locationFilter === loc
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {loc === 'all' ? 'All regions' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Produce</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Farmer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Qty</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Ask Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Market Range</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((listing) => (
              <tr key={listing.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link to={`/listing/${listing.id}`} className="font-medium text-foreground hover:text-primary hover:underline">
                    {listing.produce}
                  </Link>
                  <p className="text-xs text-muted-foreground">{listing.variety}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{listing.farmer.name}</p>
                  <p className="text-xs text-muted-foreground">{listing.farmer.rating}★</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{listing.location}</td>
                <td className="px-4 py-3 text-right text-foreground">{listing.quantity} {listing.unit}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">${listing.pricePerUnit.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">${listing.marketLow.toFixed(2)}–${listing.marketHigh.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    listing.status === 'active' ? 'bg-primary/10 text-primary' :
                    listing.status === 'in_negotiation' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {listing.status === 'in_negotiation' ? 'Negotiating' : listing.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {filtered.map((listing) => (
          <Link
            key={listing.id}
            to={`/listing/${listing.id}`}
            className="block rounded border border-border p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{listing.produce} — {listing.variety}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {listing.farmer.name} · {listing.location}
                </p>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                listing.status === 'active' ? 'bg-primary/10 text-primary' :
                listing.status === 'in_negotiation' ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>
                {listing.status === 'in_negotiation' ? 'Negotiating' : listing.status}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">{listing.quantity} {listing.unit}</span>
              <span className="font-medium text-foreground">${listing.pricePerUnit.toFixed(2)}/kg</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Market: ${listing.marketLow.toFixed(2)}–${listing.marketHigh.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No listings match your search.
        </p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Prices are per kilogram in USD. Market ranges are based on the last 30 days of confirmed transactions.
      </p>
    </AppLayout>
  );
};

export default Marketplace;
