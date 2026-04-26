"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function ClientShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#050D1A] min-h-screen relative z-10">{children}</div>
    );
  }

  return (
    <AuthProvider>
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
