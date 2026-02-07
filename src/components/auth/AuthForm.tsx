import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

type AuthMode = 'signin' | 'signup';

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-sm">
      {/* Mode toggle */}
      <div className="mb-6 flex border-b border-border">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={cn(
            'pb-2.5 text-sm font-medium transition-colors',
            mode === 'signin'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'ml-6 pb-2.5 text-sm font-medium transition-colors',
            mode === 'signup'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Create account
        </button>
      </div>

      {/* Role selection */}
      <fieldset className="mb-6">
        <legend className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          I am a
        </legend>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole('farmer')}
            className={cn(
              'flex-1 rounded border px-4 py-3 text-left transition-colors',
              selectedRole === 'farmer'
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
            )}
          >
            <span className="block text-sm font-medium">Farmer</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Post produce, negotiate prices
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('buyer')}
            className={cn(
              'flex-1 rounded border px-4 py-3 text-left transition-colors',
              selectedRole === 'buyer'
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
            )}
          >
            <span className="block text-sm font-medium">Buyer</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Browse produce, make offers
            </span>
          </button>
        </div>
      </fieldset>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tendai Moyo"
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Masvingo Province"
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
        {mode === 'signin'
          ? 'No account yet? Switch to Create account above.'
          : 'Already have an account? Switch to Sign in above.'}
      </p>
    </div>
  );
};
