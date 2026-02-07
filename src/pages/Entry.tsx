import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Entry = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left column — information */}
      <div className="flex flex-1 flex-col justify-center px-8 py-16 md:px-16 lg:px-24">
        <div className="max-w-lg">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Agricultural Marketplace — Zimbabwe
          </p>

          <h1 className="mb-6 font-heading text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            AgriTrust
          </h1>

          <div className="mb-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              AgriTrust is a marketplace for smallholder farmers and buyers to negotiate
              produce prices with data-supported guidance. It is not an auction. It is
              not a fixed-price store.
            </p>
            <p>
              The system shows market price ranges, historical data, and evidence to
              support fair negotiation. Both sides retain full decision-making power.
            </p>
            <p>
              Designed for transparency, traceability, and trust.
            </p>
          </div>

          <div className="mb-12 border-l-2 border-primary/30 pl-4">
            <h2 className="mb-2 font-heading text-sm font-semibold text-foreground">
              After signing in, you can:
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Post produce with quantity, quality, and pricing context</li>
              <li>Browse available produce with market data</li>
              <li>Negotiate prices with evidence-backed guidance</li>
              <li>Track transactions and build a verifiable record</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Enter as Farmer
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Enter as Buyer
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right column — contextual info */}
      <div className="hidden flex-col justify-end border-l border-border bg-card p-12 lg:flex lg:w-96">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current season</p>
            <p className="mt-1 font-heading text-lg text-foreground">2025/26 Summer</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active listings</p>
            <p className="mt-1 font-heading text-lg text-foreground">142</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Negotiations this week</p>
            <p className="mt-1 font-heading text-lg text-foreground">38</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Registered users</p>
            <p className="mt-1 font-heading text-lg text-foreground">1,204</p>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              AgriTrust is operated as a public service tool. It does not buy, sell, or
              hold produce. All transactions are between registered users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entry;
