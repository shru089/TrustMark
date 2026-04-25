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
    return <div className="w-28 h-9 rounded-md bg-gray-800 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 font-bold hidden sm:block tracking-tight">{user.email}</span>
        <button
          onClick={logout}
          className="text-sm bg-white/60 hover:bg-[#922D50] hover:text-white text-[#922D50] px-6 py-3 rounded-full font-bold transition-all border border-[#922D50]/20"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="btn-liquid px-8 py-3 text-sm shadow-md"
    >
      Sign In
    </button>
  );
}
