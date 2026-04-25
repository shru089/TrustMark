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

  // Return a simple loading state or the children without providers during SSR
  if (!mounted) {
    return <div className="bg-[#080b14] min-h-screen">{children}</div>;
  }

  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
