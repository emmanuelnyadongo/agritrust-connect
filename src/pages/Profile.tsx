import { AppLayout } from '@/layouts/AppLayout';
import { currentUser } from '@/data/mock';
import { transactions } from '@/data/mock';

const Profile = () => {
  const completedCount = transactions.filter((t) => t.status === 'completed').length;
  const disputedCount = transactions.filter((t) => t.status === 'disputed').length;

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Profile
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
          {currentUser.name}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Identity */}
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Identity
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground">{currentUser.name}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="text-foreground capitalize">{currentUser.role}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="text-foreground">{currentUser.location}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="text-foreground">{currentUser.joined}</dd>
              </div>
            </dl>
          </section>

          {/* Activity summary */}
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Activity Summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Completed transactions</dt>
                <dd className="font-medium text-foreground">{completedCount}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Disputes</dt>
                <dd className={`font-medium ${disputedCount > 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {disputedCount}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Dispute rate</dt>
                <dd className="text-foreground">
                  {completedCount > 0
                    ? ((disputedCount / (completedCount + disputedCount)) * 100).toFixed(1)
                    : '0.0'
                  }%
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Trust signals */}
        <div className="space-y-6">
          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Trust Score
            </h3>
            <p className="font-heading text-3xl font-semibold text-primary">
              {currentUser.rating}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              out of 5.0 · Based on {currentUser.completedTransactions} completed transactions
            </p>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
              Consistency Indicators
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Verified identity
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Active for {new Date().getFullYear() - new Date(currentUser.joined).getFullYear()} years
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {currentUser.completedTransactions}+ completed trades
              </li>
              <li className="flex items-center gap-2">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${disputedCount === 0 ? 'bg-primary' : 'bg-warning'}`} />
                {disputedCount === 0 ? 'No disputes on record' : `${disputedCount} dispute(s) on record`}
              </li>
            </ul>
          </section>

          <div className="rounded border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Trust signals are derived from transaction records. They cannot be
              edited manually and update automatically.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
