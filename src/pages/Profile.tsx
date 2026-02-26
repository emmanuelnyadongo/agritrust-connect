import { AppLayout } from '@/layouts/AppLayout';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getTransactionsForUser } from '@/services/supabaseService';

const Profile = () => {
  const { user, profile, loading } = useAuth();

  const {
    data: transactions = [],
  } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => getTransactionsForUser(user!.id),
    enabled: !!user,
  });

  const completedCount = transactions.filter((t: any) => t.status === 'completed').length;
  const disputedCount = transactions.filter((t: any) => t.status === 'disputed').length;

  if (loading) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </AppLayout>
    );
  }

  if (!user || !profile) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Profile not found.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Profile</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
          {profile.name}
        </h1>
      </header>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Identity</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Name', profile.name],
                ['Role', profile.role],
                ['Location', profile.location],
                ['Member since', new Date(profile.joined).toLocaleDateString('en-ZW')],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium capitalize text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Activity Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Completed transactions</dt>
                <dd className="font-medium text-foreground">{completedCount}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Disputes</dt>
                <dd className={`font-medium ${disputedCount > 0 ? 'text-destructive' : 'text-foreground'}`}>{disputedCount}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Dispute rate</dt>
                <dd className="text-foreground">
                  {completedCount > 0 ? ((disputedCount / (completedCount + disputedCount)) * 100).toFixed(1) : '0.0'}%
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Trust Score</h3>
            <p className="font-heading text-3xl font-semibold text-primary">
              {profile.rating ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              out of 5.0 · Based on {profile.completed_transactions ?? 0} completed transactions
            </p>
          </section>

          <section className="rounded border border-border p-4">
            <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Consistency Indicators</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Verified identity
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Active for {new Date().getFullYear() - new Date(profile.joined).getFullYear()} years
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {profile.completed_transactions ?? 0}+ completed trades
              </li>
              <li className="flex items-center gap-2">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${disputedCount === 0 ? 'bg-primary' : 'bg-warning'}`} />
                {disputedCount === 0 ? 'No disputes on record' : `${disputedCount} dispute(s) on record`}
              </li>
            </ul>
          </section>

          <div className="rounded border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Trust signals are derived from transaction records. They cannot be edited manually and update automatically.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
