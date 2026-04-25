"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthButton from "@/components/AuthButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white/40 backdrop-blur-3xl border-b border-white/60 sticky top-0 z-50 px-6 py-1">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-16">
            <Link href="/" className="text-3xl font-black text-[#1a1c1e] tracking-tighter flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#006D77] to-[#922D50] shadow-lg group-hover:rotate-180 transition-transform duration-1000" />
              TrustMark
            </Link>
            
            <div className="hidden md:flex space-x-10">
              <Link href="/protect" className="text-gray-600 hover:text-[#006D77] transition-colors font-bold text-lg">
                Protect
              </Link>
              <Link href="/verify" className="text-gray-600 hover:text-[#922D50] transition-colors font-bold text-lg">
                Verify
              </Link>
              {user && (
                <Link href="/dashboard" className="text-gray-600 hover:text-[#DC9E82] transition-colors font-bold text-lg">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
