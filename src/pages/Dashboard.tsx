import { AppLayout } from '@/layouts/AppLayout';
import { useRole } from '@/hooks/useRole';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getListings, getNegotiationsForUser, getTransactionsForUser } from '@/services/supabaseService';

const Dashboard = () => {
  const { role } = useRole();
  const { user } = useAuth();

  const {
    data: listings = [],
  } = useQuery({
    queryKey: ['dashboard:listings', { userId: user?.id, role }],
    queryFn: () =>
      role === 'farmer'
        ? getListings({ farmerId: user!.id })
        : getListings({ status: 'active' }),
    enabled: !!user,
  });

  const {
    data: negotiations = [],
  } = useQuery({
    queryKey: ['dashboard:negotiations', { userId: user?.id, role }],
    queryFn: () => getNegotiationsForUser(user!.id, role),
    enabled: !!user,
  });

  const {
    data: transactions = [],
  } = useQuery({
    queryKey: ['dashboard:transactions', user?.id],
    queryFn: () => getTransactionsForUser(user!.id),
    enabled: !!user,
  });

  return (
    <AppLayout>
      <header className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {role === 'farmer' ? 'Farmer' : 'Buyer'} Dashboard
          </p>
          <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
            {role === 'farmer' ? 'Your Farm Operations' : 'Procurement Overview'}
          </h1>
        </div>
        {role === 'farmer' && (
          <Link
            to="/listing/new"
            className="hidden rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-block"
          >
            New listing
          </Link>
        )}
      </header>

      {role === 'farmer' ? (
        <FarmerDashboard listings={listings} negotiations={negotiations} transactions={transactions} />
      ) : (
        <BuyerDashboard listings={listings} negotiations={negotiations} transactions={transactions} />
      )}
    </AppLayout>
  );
};

/* ─── Responsive price table used by both dashboards ─── */
const PriceTable = ({ rows, columns }: { rows: any[]; columns: { key: string; label: string; align?: string; highlight?: boolean }[] }) => (
  <>
    {/* Desktop */}
    <div className="hidden overflow-hidden rounded border border-border sm:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2.5 text-xs font-medium text-muted-foreground ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-2.5 ${col.align === 'right' ? 'text-right' : ''} ${col.highlight ? 'font-medium text-primary' : row._firstCol === col.key ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Mobile */}
    <div className="space-y-2 sm:hidden">
      {rows.map((row, i) => (
        <div key={i} className="rounded border border-border p-3">
          <p className="text-sm font-medium text-foreground">{row[columns[0].key]}</p>
          <div className="mt-1.5 space-y-1">
            {columns.slice(1).map((col) => (
              <div key={col.key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{col.label}</span>
                <span className={col.highlight ? 'font-medium text-primary' : 'text-foreground'}>{row[col.key]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </>
);

const FarmerDashboard = ({ listings, negotiations, transactions }: { listings: any[]; negotiations: any[]; transactions: any[] }) => {
  const myListings = listings;
  const myNegotiations = negotiations;
  const recentTransactions = transactions.slice(0, 3);

  const priceRows = [
    { name: 'Maize (SC 513)', low: '$0.35', med: '$0.44', high: '$0.52' },
    { name: 'Soya Beans', low: '$0.55', med: '$0.66', high: '$0.78' },
    { name: 'Groundnuts', low: '$1.50', med: '$1.85', high: '$2.20' },
    { name: 'Sugar Beans', low: '$1.00', med: '$1.22', high: '$1.45' },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Market Price Signals</h2>
        <PriceTable
          rows={priceRows}
          columns={[
            { key: 'name', label: 'Produce' },
            { key: 'low', label: 'Low', align: 'right' },
            { key: 'med', label: 'Median', align: 'right', highlight: true },
            { key: 'high', label: 'High', align: 'right' },
          ]}
        />
        <p className="mt-2 text-xs text-muted-foreground">Per kg · Based on last 30 days of confirmed transactions</p>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Your Active Listings</h2>
          <Link to="/marketplace" className="text-xs font-medium text-primary hover:underline">View all</Link>
        </div>
        <div className="space-y-2">
            {myListings.map((listing: any) => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="flex items-center justify-between rounded border border-border px-3 py-3 transition-colors hover:bg-muted/50 sm:px-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{listing.produce} — {listing.variety}</p>
                <p className="text-xs text-muted-foreground">
                  {listing.remaining_quantity != null ? `${listing.remaining_quantity} ${listing.unit} left` : `${listing.quantity} ${listing.unit}`} · {listing.location}
                </p>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
                <span className="hidden rounded px-2 py-0.5 text-xs font-medium sm:inline-block bg-primary/10 text-primary">
                  {listing.status === 'in_negotiation' ? 'Negotiating' : listing.status}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Negotiations</h2>
        {myNegotiations.length > 0 ? (
          <div className="space-y-2">
            {myNegotiations.map((neg: any) => (
              <Link key={neg.id} to={`/negotiation/${neg.id}`} className="flex items-center justify-between rounded border border-border px-3 py-3 transition-colors hover:bg-muted/50 sm:px-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {neg.listing?.produce} — {neg.listing?.quantity} {neg.listing?.unit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    with {neg.buyer?.name ?? 'Buyer'}
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
                  <span className="text-xs text-muted-foreground">
                    Guidance: ${neg.system_guidance?.toFixed(2) ?? '0.00'}/kg
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active negotiations.</p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Recent Outcomes</h2>
          <Link to="/transactions" className="text-xs font-medium text-primary hover:underline">Full history</Link>
        </div>
        <PriceTable
          rows={recentTransactions.map((t: any) => ({
            produce: t.produce,
            buyer: t.buyer?.name,
            price: `$${t.agreed_price.toFixed(2)}`,
            date: t.date,
          }))}
          columns={[
            { key: 'produce', label: 'Produce' },
            { key: 'buyer', label: 'Buyer' },
            { key: 'price', label: 'Price/kg', align: 'right' },
            { key: 'date', label: 'Date', align: 'right' },
          ]}
        />
      </section>
    </div>
  );
};

const BuyerDashboard = ({ listings, negotiations, transactions }: { listings: any[]; negotiations: any[]; transactions: any[] }) => {
  const activeListings = listings;
  const myNegotiations = negotiations;
  const recentTransactions = transactions.slice(0, 3);

  const marketRows = [
    { name: 'Maize', qty: '5,700', range: '$0.35–$0.52', count: '4' },
    { name: 'Soya Beans', qty: '2,400', range: '$0.55–$0.78', count: '2' },
    { name: 'Groundnuts', qty: '1,200', range: '$1.50–$2.20', count: '3' },
    { name: 'Sugar Beans', qty: '750', range: '$1.00–$1.45', count: '2' },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Market Price Ranges</h2>
        <PriceTable
          rows={marketRows}
          columns={[
            { key: 'name', label: 'Produce' },
            { key: 'qty', label: 'Available (kg)', align: 'right' },
            { key: 'range', label: 'Price Range', align: 'right' },
            { key: 'count', label: 'Listings', align: 'right' },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Your Negotiations</h2>
        <div className="space-y-2">
          {myNegotiations.map((neg: any) => (
            <Link key={neg.id} to={`/negotiation/${neg.id}`} className="flex items-center justify-between rounded border border-border px-3 py-3 transition-colors hover:bg-muted/50 sm:px-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {neg.listing?.produce} — {neg.listing?.quantity} {neg.listing?.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  from {neg.listing?.farmer?.name ?? 'Farmer'}
                </p>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
                <span className="text-xs text-muted-foreground">
                  Guidance: ${neg.system_guidance?.toFixed(2) ?? '0.00'}/kg
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Available Produce</h2>
          <Link to="/marketplace" className="text-xs font-medium text-primary hover:underline">Browse marketplace</Link>
        </div>
        <div className="space-y-2">
          {activeListings.slice(0, 4).map((listing: any) => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="flex items-center justify-between rounded border border-border px-3 py-3 transition-colors hover:bg-muted/50 sm:px-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {listing.produce} — {listing.variety}
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.remaining_quantity != null ? `${listing.remaining_quantity} ${listing.unit} left` : `${listing.quantity} ${listing.unit}`} · {listing.farmer?.name ?? 'Farmer'} · {listing.location}
                </p>
              </div>
              <div className="ml-3 shrink-0 text-right">
                <p className="text-sm font-medium text-foreground">
                  ${listing.price_per_unit.toFixed(2)}/kg
                </p>
                <p className="text-xs text-muted-foreground">
                  Mkt: ${listing.market_low.toFixed(2)}–${listing.market_high.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Recent Transactions</h2>
          <Link to="/transactions" className="text-xs font-medium text-primary hover:underline">Full history</Link>
        </div>
        <PriceTable
          rows={recentTransactions.map((t: any) => ({
            produce: t.produce,
            farmer: t.farmer?.name,
            price: `$${t.agreed_price.toFixed(2)}`,
            date: t.date,
          }))}
          columns={[
            { key: 'produce', label: 'Produce' },
            { key: 'farmer', label: 'Farmer' },
            { key: 'price', label: 'Price/kg', align: 'right' },
            { key: 'date', label: 'Date', align: 'right' },
          ]}
        />
      </section>
    </div>
  );
};

export default Dashboard;
