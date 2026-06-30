import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type AffiliateAuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AffiliateAuthContext = createContext<AffiliateAuthContextValue | undefined>(undefined);

export const AffiliateAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AffiliateAuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
    }),
    [loading, session],
  );

  return <AffiliateAuthContext.Provider value={value}>{children}</AffiliateAuthContext.Provider>;
};

export const useAffiliateAuth = () => {
  const context = useContext(AffiliateAuthContext);
  if (!context) {
    throw new Error("useAffiliateAuth must be used within AffiliateAuthProvider.");
  }
  return context;
};
