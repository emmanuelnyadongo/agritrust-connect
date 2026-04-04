import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getProfile } from '@/services/supabaseService';

interface AuthContextValue {
  user: any | null;
  profile: any | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refetchProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<AuthContextValue>({
    user: null,
    profile: null,
    loading: true,
    refetchProfile: async () => {},
  });

  const refetchProfile = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session?.user) return;
    try {
      const profile = await getProfile(session.user.id);
      setValue((prev) => ({ ...prev, profile, loading: false }));
    } catch {
      setValue((prev) => ({ ...prev, profile: null, loading: false }));
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        if (!cancelled) {
          setValue((prev) => ({ ...prev, user: null, profile: null, loading: false }));
        }
        return;
      }

      const user = session.user;
      try {
        const profile = await getProfile(user.id);
        if (!cancelled) {
          setValue((prev) => ({ ...prev, user, profile, loading: false }));
        }
      } catch {
        if (!cancelled) {
          setValue((prev) => ({ ...prev, user, profile: null, loading: false }));
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setValue({ user: null, profile: null, loading: false });
        return;
      }

      const user = session.user;
      getProfile(user.id)
        .then((profile) => setValue((prev) => ({ ...prev, user, profile, loading: false, refetchProfile })))
        .catch(() => setValue((prev) => ({ ...prev, user, profile: null, loading: false, refetchProfile })));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

