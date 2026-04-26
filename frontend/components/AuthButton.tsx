"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AuthButton() {
  const { user, login, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="w-28 h-9 rounded-full bg-white/[0.06] animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          {user.photoURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-7 h-7 rounded-full border border-white/20"
            />
          )}
          <span className="text-xs text-[#8899AA] font-medium truncate max-w-[140px]">
            {user.email}
          </span>
        </div>
        <button
          id="auth-signout-btn"
          onClick={logout}
          className="btn-ghost text-xs"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      id="auth-signin-btn"
      onClick={login}
      className="btn-primary text-sm px-5 py-2.5"
    >
      Sign In
    </button>
  );
}
