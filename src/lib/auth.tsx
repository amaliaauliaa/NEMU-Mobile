// CODELAB 4 - AuthContext: "Central Command HQ" untuk status login
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "./supabase";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isLoading: boolean; // true selama session masih dibaca dari SecureStore
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. REHYDRATION: saat app dibuka, minta Supabase baca session dari SecureStore
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setSession(data.session);
      })
      .catch((e) => console.warn("getSession gagal:", e))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    // 2. LIVE BROADCASTER: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, dll.
    // Catatan: jangan panggil supabase.* async di dalam callback ini (bisa deadlock).
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth Event Fired:", event);
      setSession(newSession);
      setIsLoading(false);
    });

    // 3. CLEANUP: berhenti mendengarkan saat provider di-unmount
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.warn("signOut gagal:", error.message);
      },
    }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
