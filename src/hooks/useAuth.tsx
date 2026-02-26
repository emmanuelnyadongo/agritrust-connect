import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getProfile } from '@/services/supabaseService';

interface AuthContextValue {
  user: any | null;
  profile: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<AuthContextValue>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        if (!cancelled) {
          setValue({ user: null, profile: null, loading: false });
        }
        return;
      }

      const user = session.user;
      try {
        const profile = await getProfile(user.id);
        if (!cancelled) {
          setValue({ user, profile, loading: false });
        }
      } catch {
        if (!cancelled) {
          setValue({ user, profile: null, loading: false });
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
        .then((profile) => setValue({ user, profile, loading: false }))
        .catch(() => setValue({ user, profile: null, loading: false }));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

