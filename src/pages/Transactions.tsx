import { AppLayout } from '@/layouts/AppLayout';
import { transactions } from '@/data/mock';

const Transactions = () => {
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
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                <td className="px-4 py-3 font-medium text-foreground">{t.produce}</td>
                <td className="px-4 py-3 text-foreground">{t.quantity}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.buyer.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.farmer.name}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">${t.agreedPrice.toFixed(2)}/kg</td>
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
        {transactions.map((t) => (
          <div key={t.id} className="rounded border border-border p-4">
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
                <span className="font-medium text-foreground">${t.agreedPrice.toFixed(2)}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farmer</span>
                <span className="text-foreground">{t.farmer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buyer</span>
                <span className="text-foreground">{t.buyer.name}</span>
              </div>
            </div>
          </div>
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
