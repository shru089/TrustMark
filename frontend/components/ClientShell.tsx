"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
