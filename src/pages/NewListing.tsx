import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { createListing } from '@/services/supabaseService';

const NewListing = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    produce: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    quality: '',
    location: '',
    pricePerUnit: '',
    marketLow: '',
    marketHigh: '',
    marketMedian: '',
    availableFrom: '',
    availableUntil: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!profile) {
    return (
      <AppLayout>
        <p className="text-sm text-muted-foreground">Profile not loaded.</p>
      </AppLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const row = {
        farmer_id: profile.id,
        produce: form.produce,
        variety: form.variety,
        quantity: form.quantity,
        unit: form.unit,
        quality: form.quality,
        location: form.location,
        price_per_unit: parseFloat(form.pricePerUnit),
        market_low: parseFloat(form.marketLow || form.pricePerUnit),
        market_high: parseFloat(form.marketHigh || form.pricePerUnit),
        market_median: parseFloat(form.marketMedian || form.pricePerUnit),
        available_from: form.availableFrom,
        available_until: form.availableUntil,
        description: form.description,
        status: 'active',
      };

      const listing = await createListing(row);
      navigate(`/listing/${listing.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Farmer · New Listing
        </p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Create Produce Listing
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Produce</label>
            <input
              name="produce"
              value={form.produce}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Variety</label>
            <input
              name="variety"
              value={form.variety}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Quantity</label>
            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="kg">kg</option>
              <option value="tonne">tonne</option>
              <option value="bag">bag</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Quality</label>
          <input
            name="quality"
            value={form.quality}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Ask price ($/kg)</label>
            <input
              name="pricePerUnit"
              type="number"
              step="0.01"
              value={form.pricePerUnit}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Market low</label>
            <input
              name="marketLow"
              type="number"
              step="0.01"
              value={form.marketLow}
              onChange={handleChange}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Market median</label>
            <input
              name="marketMedian"
              type="number"
              step="0.01"
              value={form.marketMedian}
              onChange={handleChange}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Market high</label>
            <input
              name="marketHigh"
              type="number"
              step="0.01"
              value={form.marketHigh}
              onChange={handleChange}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Available from</label>
            <input
              name="availableFrom"
              type="date"
              value={form.availableFrom}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Available until</label>
            <input
              name="availableUntil"
              type="date"
              value={form.availableUntil}
              onChange={handleChange}
              required
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? 'Creating listing…' : 'Create listing'}
        </button>
      </form>
    </AppLayout>
  );
};

export default NewListing;

