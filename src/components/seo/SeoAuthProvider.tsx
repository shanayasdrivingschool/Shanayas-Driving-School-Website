import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { SeoAuthContext } from "@/components/seo/seoAuthContext";

export const SeoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const { isSupabaseConfigured, supabase } = await import("@/lib/supabaseClient");
      if (!active) return;
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setLoading(false);
      });
      unsubscribe = () => listener.subscription.unsubscribe();
      if (!active) unsubscribe();
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => ({ session, user: session?.user ?? null, loading }), [loading, session]);
  return <SeoAuthContext.Provider value={value}>{children}</SeoAuthContext.Provider>;
};
