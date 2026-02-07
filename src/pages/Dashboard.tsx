import { AppLayout } from '@/layouts/AppLayout';
import { useRole } from '@/hooks/useRole';
import { listings, negotiations, transactions } from '@/data/mock';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { role } = useRole();

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {role === 'farmer' ? 'Farmer' : 'Buyer'} Dashboard
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
          {role === 'farmer' ? 'Your Farm Operations' : 'Procurement Overview'}
        </h1>
      </header>

      {role === 'farmer' ? <FarmerDashboard /> : <BuyerDashboard />}
    </AppLayout>
  );
};

const FarmerDashboard = () => {
  const myListings = listings.filter((l) => l.farmer.id === 'u1');
  const myNegotiations = negotiations.filter((n) => n.farmer.id === 'u1');
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Price signals */}
      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Market Price Signals
        </h2>
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Produce</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Low</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Median</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">High</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Maize (SC 513)', low: 0.35, med: 0.44, high: 0.52 },
                { name: 'Soya Beans', low: 0.55, med: 0.66, high: 0.78 },
                { name: 'Groundnuts', low: 1.50, med: 1.85, high: 2.20 },
                { name: 'Sugar Beans', low: 1.00, med: 1.22, high: 1.45 },
              ].map((item) => (
                <tr key={item.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">${item.low.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-primary">${item.med.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">${item.high.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Per kg · Based on last 30 days of confirmed transactions</p>
      </section>

      {/* Active listings */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Your Active Listings</h2>
          <Link to="/marketplace" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {myListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="flex items-center justify-between rounded border border-border px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {listing.produce} — {listing.variety}
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.quantity} {listing.unit} · {listing.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                  listing.status === 'active' ? 'bg-primary/10 text-primary' :
                  listing.status === 'in_negotiation' ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {listing.status === 'in_negotiation' ? 'Negotiating' : listing.status}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Active negotiations */}
      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Negotiations
        </h2>
        {myNegotiations.length > 0 ? (
          <div className="space-y-2">
            {myNegotiations.map((neg) => (
              <Link
                key={neg.id}
                to={`/negotiation/${neg.id}`}
                className="flex items-center justify-between rounded border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{neg.produce}</p>
                  <p className="text-xs text-muted-foreground">
                    with {neg.buyer.name} · {neg.offers.length} offer{neg.offers.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Last: ${neg.offers[neg.offers.length - 1]?.price.toFixed(2)}/kg
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

      {/* Recent transactions */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Recent Outcomes</h2>
          <Link to="/transactions" className="text-xs font-medium text-primary hover:underline">
            Full history
          </Link>
        </div>
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Produce</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Buyer</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Price/kg</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{t.produce}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{t.buyer.name}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-foreground">${t.agreedPrice.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const BuyerDashboard = () => {
  const activeListings = listings.filter((l) => l.status === 'active');
  const myNegotiations = negotiations;
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Market overview */}
      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Market Price Ranges
        </h2>
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Produce</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Available (kg)</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Price Range</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Listings</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Maize', qty: '5,700', range: '$0.35–$0.52', count: 4 },
                { name: 'Soya Beans', qty: '2,400', range: '$0.55–$0.78', count: 2 },
                { name: 'Groundnuts', qty: '1,200', range: '$1.50–$2.20', count: 3 },
                { name: 'Sugar Beans', qty: '750', range: '$1.00–$1.45', count: 2 },
              ].map((item) => (
                <tr key={item.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{item.qty}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">{item.range}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Negotiations in progress */}
      <section>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Your Negotiations
        </h2>
        <div className="space-y-2">
          {myNegotiations.map((neg) => (
            <Link
              key={neg.id}
              to={`/negotiation/${neg.id}`}
              className="flex items-center justify-between rounded border border-border px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{neg.produce}</p>
                <p className="text-xs text-muted-foreground">
                  from {neg.farmer.name} · {neg.offers.length} offer{neg.offers.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Last: ${neg.offers[neg.offers.length - 1]?.price.toFixed(2)}/kg
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Available produce */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Available Produce</h2>
          <Link to="/marketplace" className="text-xs font-medium text-primary hover:underline">
            Browse marketplace
          </Link>
        </div>
        <div className="space-y-2">
          {activeListings.slice(0, 4).map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="flex items-center justify-between rounded border border-border px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {listing.produce} — {listing.variety}
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.quantity} {listing.unit} · {listing.farmer.name} · {listing.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">${listing.pricePerUnit.toFixed(2)}/kg</p>
                <p className="text-xs text-muted-foreground">
                  Market: ${listing.marketLow.toFixed(2)}–${listing.marketHigh.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Transaction history */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Recent Transactions</h2>
          <Link to="/transactions" className="text-xs font-medium text-primary hover:underline">
            Full history
          </Link>
        </div>
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Produce</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Farmer</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Price/kg</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{t.produce}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{t.farmer.name}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-foreground">${t.agreedPrice.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
