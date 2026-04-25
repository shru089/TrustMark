"use client";

/**
 * AuthContext – manages Firebase auth state across the entire app.
 *
 * Wrap your root layout with <AuthProvider> and consume via useAuth().
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthChange, signInWithGoogle, signOut, type User } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Force loading to false after 3s max, in case Firebase stalls
    const timeout = setTimeout(() => setLoading(false), 3000);

    const unsubscribe = onAuthChange((u) => {
      clearTimeout(timeout);
      setUser(u);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error.code === "auth/unauthorized-domain") {
        alert("Domain not authorized! Please add localhost:3005 to Firebase → Auth → Settings → Authorized Domains.");
      } else {
        alert(`Sign-in failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
