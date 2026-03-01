import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getTransactionsForUser, updateProfile } from '@/services/supabaseService';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, loading, refetchProfile } = useAuth();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

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
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Phone (for contact after transactions)</dt>
                <dd className="text-right">
                  {isEditingPhone ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="tel"
                        value={phoneEdit}
                        onChange={(e) => setPhoneEdit(e.target.value)}
                        placeholder="e.g. +263 77 123 4567"
                        className="w-40 rounded border border-input bg-background px-2 py-1 text-right text-sm"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          setSavingPhone(true);
                          try {
                            await updateProfile(user!.id, { phone: phoneEdit.trim() || null });
                            await refetchProfile();
                            setIsEditingPhone(false);
                            setPhoneEdit('');
                            toast.success('Phone saved');
                          } catch {
                            toast.error('Failed to save');
                          } finally {
                            setSavingPhone(false);
                          }
                        }}
                        disabled={savingPhone}
                        className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsEditingPhone(false); setPhoneEdit(''); }}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setIsEditingPhone(true); setPhoneEdit(profile.phone || ''); }}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {profile.phone || 'Add number'}
                    </button>
                  )}
                </dd>
              </div>
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
              {profile.rating ?? '—'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              out of 5.0 · Average of ratings from buyers and farmers you have traded with. Updates after each rating.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.completed_transactions ?? 0} completed transactions
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
              Trust score is the average of 1–5 star ratings given by the other party after each transaction. Completed-transaction count updates automatically when a deal is agreed.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
