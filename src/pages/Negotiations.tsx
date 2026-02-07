import { AppLayout } from '@/layouts/AppLayout';
import { negotiations } from '@/data/mock';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Negotiations = () => {
  return (
    <AppLayout>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Negotiations
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
          Active Negotiations
        </h1>
      </header>

      <div className="space-y-2">
        {negotiations.map((neg) => (
          <Link
            key={neg.id}
            to={`/negotiation/${neg.id}`}
            className="flex items-center justify-between rounded border border-border px-5 py-4 transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{neg.produce}</p>
              <p className="text-xs text-muted-foreground">
                {neg.farmer.name} ↔ {neg.buyer.name} · {neg.offers.length} offer{neg.offers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  ${neg.offers[neg.offers.length - 1]?.price.toFixed(2)}/kg
                </p>
                <p className="text-xs text-muted-foreground">
                  Guidance: ${neg.systemGuidance.toFixed(2)}
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {negotiations.length === 0 && (
        <p className="text-sm text-muted-foreground">No active negotiations.</p>
      )}
    </AppLayout>
  );
};

export default Negotiations;
