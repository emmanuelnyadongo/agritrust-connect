import { AuthForm } from '@/components/auth/AuthForm';

const Entry = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left column — information */}
      <div className="hidden flex-col justify-between border-r border-border bg-card p-8 md:flex md:w-[340px] lg:w-[440px] lg:p-10 xl:p-14">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Agricultural Marketplace — Zimbabwe
          </p>
          <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight text-foreground">
            AgriTrust
          </h1>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            AgriTrust is a marketplace for smallholder farmers and buyers to negotiate
            produce prices with data-supported guidance. It is not an auction. It is
            not a fixed-price store.
          </p>
          <p>
            The system shows market price ranges, historical data, and evidence to
            support fair negotiation. Both sides retain full decision-making power.
          </p>

          <div className="border-l-2 border-primary/30 pl-4">
            <h2 className="mb-2 font-heading text-sm font-semibold text-foreground">
              After signing in, you can:
            </h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Post produce with quantity, quality, and pricing context</li>
              <li>Browse available produce with market data</li>
              <li>Negotiate prices with evidence-backed guidance</li>
              <li>Track transactions and build a verifiable record</li>
            </ul>
          </div>
        </div>

        <div className="space-y-5 border-t border-border pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current season</p>
              <p className="mt-1 font-heading text-base text-foreground">2025/26 Summer</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active listings</p>
              <p className="mt-1 font-heading text-base text-foreground">142</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Trending produce</p>
              <p className="mt-1 font-heading text-base text-foreground">Maize (SC 513)</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Registered users</p>
              <p className="mt-1 font-heading text-base text-foreground">1,204</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AgriTrust is operated as a public service tool. It does not buy, sell, or
            hold produce. All transactions are between registered users.
          </p>
        </div>
      </div>

      {/* Right column — auth form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile header */}
        <div className="mb-8 text-center lg:hidden">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Agricultural Marketplace — Zimbabwe
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            AgriTrust
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Data-supported price negotiation for farmers and buyers.
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
};

export default Entry;
