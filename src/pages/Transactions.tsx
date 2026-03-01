import { AppLayout } from '@/layouts/AppLayout';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTransactionsForUser } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';

const Transactions = () => {
  const { user } = useAuth();

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => getTransactionsForUser(user!.id),
    enabled: !!user,
  });

  return (
    <AppLayout>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Records
        </p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Transaction History
        </h1>
      </header>

      {isLoading && (
        <p className="mb-4 text-sm text-muted-foreground">Loading transactions…</p>
      )}

      {isError && (
        <p className="mb-4 text-sm text-destructive">
          Unable to load transactions. Please refresh the page.
        </p>
      )}

      <div className="mb-6 rounded border border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Payment:</span> AgriTrust does not process payments.
          Payment is arranged directly between buyer and farmer (e.g. cash, mobile money). Click a transaction to contact the other party or use the in-app thread.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Produce</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Farmer</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Agreed Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link to={`/transactions/${t.id}`} className="hover:text-primary hover:underline">{t.produce}</Link>
                </td>
                <td className="px-4 py-3 text-foreground">{t.quantity}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.buyer?.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.farmer?.name}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">${t.agreed_price.toFixed(2)}/kg</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    t.status === 'completed' ? 'bg-primary/10 text-primary' :
                    t.status === 'disputed' ? 'bg-destructive/10 text-destructive' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {transactions.map((t: any) => (
          <Link key={t.id} to={`/transactions/${t.id}`} className="block rounded border border-border p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{t.produce}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.date}</p>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                t.status === 'completed' ? 'bg-primary/10 text-primary' :
                t.status === 'disputed' ? 'bg-destructive/10 text-destructive' :
                'bg-warning/10 text-warning'
              }`}>
                {t.status}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="text-foreground">{t.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agreed price</span>
                <span className="font-medium text-foreground">${t.agreed_price.toFixed(2)}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farmer</span>
                <span className="text-foreground">{t.farmer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buyer</span>
                <span className="text-foreground">{t.buyer?.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 border-l-2 border-border pl-4">
        <p className="text-xs text-muted-foreground">
          All records are permanent. Disputed transactions are flagged for review.
          Contact AgriTrust support for resolution assistance.
        </p>
      </div>
    </AppLayout>
  );
};

export default Transactions;
