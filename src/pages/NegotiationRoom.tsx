import { AppLayout } from '@/layouts/AppLayout';
import { negotiations } from '@/data/mock';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const NegotiationRoom = () => {
  const { id } = useParams();
  const negotiation = negotiations.find((n) => n.id === id);
  const [newPrice, setNewPrice] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!negotiation) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Negotiation not found.</p>
        <Link to="/dashboard" className="mt-2 text-sm text-primary hover:underline">Return to dashboard</Link>
      </AppLayout>
    );
  }

  const lastOffer = negotiation.offers[negotiation.offers.length - 1];
  const guidanceDiff = lastOffer
    ? ((lastOffer.price - negotiation.systemGuidance) / negotiation.systemGuidance * 100).toFixed(1)
    : '0';

  return (
    <AppLayout>
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to dashboard
      </Link>

      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Negotiation</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">{negotiation.produce}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {negotiation.farmer.name} ↔ {negotiation.buyer.name} · Started {negotiation.createdAt}
        </p>
      </header>

      {/* Mobile: guidance summary card */}
      <div className="mb-6 rounded border border-border p-4 lg:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">System Guidance</span>
          <span className="font-heading text-lg font-semibold text-primary">${negotiation.systemGuidance.toFixed(2)}/kg</span>
        </div>
        {lastOffer && (
          <div className="mt-2 flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Last offer: ${lastOffer.price.toFixed(2)}/kg</span>
            <span className={Number(guidanceDiff) > 0 ? 'text-warning' : 'text-primary'}>
              {Number(guidanceDiff) > 0 ? '+' : ''}{guidanceDiff}% vs guidance
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Main — Offer timeline */}
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h2 className="mb-4 font-heading text-sm font-semibold text-foreground">Offer History</h2>
            <div className="space-y-0">
              {negotiation.offers.map((offer) => {
                const isFarmer = offer.from === 'farmer';
                return (
                  <div key={offer.id} className={`relative border-l-2 py-3 pl-5 sm:py-4 sm:pl-6 ${isFarmer ? 'border-primary/40' : 'border-info/40'}`}>
                    <div className={`absolute -left-[5px] top-4 h-2 w-2 rounded-full sm:top-5 ${isFarmer ? 'bg-primary' : 'bg-info'}`} />
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {isFarmer ? negotiation.farmer.name : negotiation.buyer.name}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {new Date(offer.timestamp).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="font-heading text-base font-semibold text-foreground sm:text-lg">${offer.price.toFixed(2)}/kg</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{offer.note}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {offer.price > negotiation.systemGuidance
                        ? `${((offer.price - negotiation.systemGuidance) / negotiation.systemGuidance * 100).toFixed(1)}% above`
                        : `${((negotiation.systemGuidance - offer.price) / negotiation.systemGuidance * 100).toFixed(1)}% below`
                      } system guidance
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded border border-border p-4 sm:p-5">
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Submit Counter Offer</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Your offer ($/kg)</label>
                <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder={`e.g. ${negotiation.systemGuidance.toFixed(2)}`} className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Note (optional)</label>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={2} placeholder="Explain your reasoning…" className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Submit offer</button>
            </div>
          </section>
        </div>

        {/* Sidebar — Evidence panel (hidden on mobile, summary shown above) */}
        <div className="hidden space-y-6 lg:block">
          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">System Price Guidance</h3>
            <p className="font-heading text-2xl font-semibold text-primary">${negotiation.systemGuidance.toFixed(2)}/kg</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Based on 30-day median of confirmed transactions for this produce type, quality grade, and region. This is guidance only.
            </p>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Current Position</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last offer</dt>
                <dd className="font-medium text-foreground">${lastOffer?.price.toFixed(2)}/kg</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">From</dt>
                <dd className="text-foreground">{lastOffer?.from === 'farmer' ? negotiation.farmer.name : negotiation.buyer.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">vs. Guidance</dt>
                <dd className={`font-medium ${Number(guidanceDiff) > 0 ? 'text-warning' : 'text-primary'}`}>{Number(guidanceDiff) > 0 ? '+' : ''}{guidanceDiff}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total offers</dt>
                <dd className="text-foreground">{negotiation.offers.length}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Why this guidance?</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Based on similar transactions in this region</li>
              <li>• Quality grade factored into price estimate</li>
              <li>• Seasonal trends indicate stable pricing</li>
              <li>• Guidance updates weekly with new data</li>
            </ul>
          </section>

          <div className="rounded border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span> AgriTrust does not set prices. The guidance reflects market evidence.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NegotiationRoom;
