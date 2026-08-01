import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

type AdminAuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /* The Supabase client is imported dynamically so its ~188 kB bundle stays off the
     critical path. This provider wraps the whole app, but only admin, affiliate and
     checkout routes ever authenticate, so a visitor reading a blog post should never
     pay for it. The effect was already asynchronous, so deferring the import only
     adds a microtask before the same getSession/onAuthStateChange calls run. */
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const { isSupabaseConfigured, supabase } = await import("@/lib/supabaseClient");

      if (!active) {
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      setSession(data.session);
      setLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setLoading(false);
      });

      unsubscribe = () => subscription.unsubscribe();

      /* Unmounting while the import or getSession was in flight skips the cleanup
         below, so drop the subscription here instead of leaking it. */
      if (!active) {
        unsubscribe();
      }
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
    }),
    [loading, session],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  }
  return context;
};
