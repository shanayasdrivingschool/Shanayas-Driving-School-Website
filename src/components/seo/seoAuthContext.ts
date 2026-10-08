import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type SeoAuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export const SeoAuthContext = createContext<SeoAuthContextValue | undefined>(undefined);

export const useSeoAuth = () => {
  const context = useContext(SeoAuthContext);
  if (!context) throw new Error("useSeoAuth must be used within SeoAuthProvider.");
  return context;
};
