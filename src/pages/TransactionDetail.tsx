import { AppLayout } from '@/layouts/AppLayout';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTransactionById,
  getMessagesByTransactionId,
  createMessage,
  subscribeToTransactionMessages,
  getRatingsForTransaction,
  submitRating,
} from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';

const TransactionDetail = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState('');
  const [ratingScore, setRatingScore] = useState<number | null>(null);

  const {
    data: transaction,
    isLoading: txLoading,
    isError: txError,
  } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTransactionById(id as string),
    enabled: !!id,
  });

  const {
    data: messages = [],
  } = useQuery({
    queryKey: ['transaction_messages', id],
    queryFn: () => getMessagesByTransactionId(id as string),
    enabled: !!id,
  });

  const {
    data: ratings = [],
  } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () => getRatingsForTransaction(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;
    const channel = subscribeToTransactionMessages(id, (payload) => {
      queryClient.setQueryData(['transaction_messages', id], (prev: any) => [...(prev || []), payload]);
    });
    return () => channel.unsubscribe();
  }, [id, queryClient]);

  const sendMessage = useMutation({
    mutationFn: (body: string) =>
      createMessage({ transactionId: id!, senderId: user!.id, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction_messages', id] });
      setMessageText('');
    },
  });

  const rateMutation = useMutation({
    mutationFn: (score: number) =>
      submitRating({
        transactionId: id!,
        raterId: user!.id,
        rateeId: otherPartyId!,
        score,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', id] });
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
    },
  });

  if (txLoading || !transaction) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Loading transaction…</p>
      </AppLayout>
    );
  }
  if (txError) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Transaction not found.</p>
        <Link to="/transactions" className="mt-2 text-sm text-primary hover:underline">Back to transactions</Link>
      </AppLayout>
    );
  }

  const isBuyer = user?.id === transaction.buyer_id;
  const otherParty = isBuyer ? transaction.farmer : transaction.buyer;
  const otherPartyId = otherParty?.id ?? (isBuyer ? transaction.farmer_id : transaction.buyer_id);
  const myRating = ratings.find((r: any) => r.rater_id === user?.id);
  const canRate = otherPartyId && !myRating;

  return (
    <AppLayout>
      <Link to="/transactions" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to transactions
      </Link>

      <header className="mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Transaction</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">{transaction.produce}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {transaction.quantity} · ${transaction.agreed_price.toFixed(2)}/kg · {transaction.date}
        </p>
      </header>

      {/* Message thread first so it's visible right after confirming a deal */}
      <section className="mb-6 rounded-lg border-2 border-primary/30 bg-primary/5 p-4 sm:p-5">
        <h2 className="mb-1 font-heading text-sm font-semibold text-foreground">Message the other party</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Coordinate delivery and payment with {otherParty?.name ?? (isBuyer ? 'the farmer' : 'the buyer')}. Messages appear in real time.
        </p>
        <div className="mb-4 max-h-52 space-y-2 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">No messages yet. Say hello or arrange collection below.</p>
          ) : (
            messages.map((m: any) => (
              <div
                key={m.id}
                className={`rounded p-2 text-sm ${m.sender_id === user?.id ? 'ml-4 bg-primary/10' : 'mr-4 bg-muted/50'}`}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {m.sender_id === user?.id ? 'You' : (m.sender?.name ?? otherParty?.name ?? 'Other')}
                </span>
                <p className="mt-0.5 text-foreground">{m.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded border border-input bg-background px-3 py-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (messageText.trim()) sendMessage.mutate(messageText.trim());
              }
            }}
          />
          <button
            type="button"
            onClick={() => messageText.trim() && sendMessage.mutate(messageText.trim())}
            disabled={!messageText.trim() || sendMessage.isPending}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </section>

      {/* Rate the other party — visible right after messages */}
      <section className="mb-6 rounded-lg border-2 border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800 dark:bg-amber-950/40">
        <h2 className="mb-1 font-heading text-sm font-semibold text-foreground">Rate the other party</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          How was your experience with this {isBuyer ? 'farmer' : 'buyer'}? Your rating updates their trust score.
        </p>
        {canRate ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setRatingScore(s);
                  rateMutation.mutate(s);
                }}
                disabled={rateMutation.isPending}
                className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                  ratingScore === s ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted/50'
                }`}
              >
                {s} ★
              </button>
            ))}
          </div>
        ) : myRating ? (
          <p className="text-sm text-muted-foreground">You rated this transaction {myRating.score} ★</p>
        ) : (
          <p className="text-xs text-muted-foreground">Rating will appear here once the other party is loaded.</p>
        )}
      </section>

      {/* Contact */}
      <section className="mb-6 rounded border border-border p-4">
        <h2 className="mb-2 font-heading text-sm font-semibold text-foreground">Contact</h2>
        <p className="text-sm text-foreground">{otherParty?.name ?? (isBuyer ? 'Farmer' : 'Buyer')}</p>
        {otherParty?.phone ? (
          <p className="mt-1 text-sm text-muted-foreground">Phone: {otherParty.phone}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">They haven’t added a phone number yet.</p>
        )}
      </section>

      {/* Payment note */}
      <div className="mb-6 rounded border border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Payment:</span> AgriTrust does not process payments.
          Payment (cash, mobile money, bank transfer) is arranged directly between you and the other party.
        </p>
      </div>
    </AppLayout>
  );
};

export default TransactionDetail;
