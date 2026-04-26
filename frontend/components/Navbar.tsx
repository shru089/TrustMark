"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthButton from "@/components/AuthButton";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 px-6 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#050D1A]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="TrustMark Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C2CB] to-[#E63E6D] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="currentColor" opacity="0.9"/>
              <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 17l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-[Space_Grotesk,sans-serif]">
            Trust<span className="text-gradient">Mark</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/protect"
            className="px-4 py-2 text-sm font-semibold text-[#8899AA] hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
          >
            Protect
          </Link>
          <Link
            href="/verify"
            className="px-4 py-2 text-sm font-semibold text-[#8899AA] hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
          >
            Verify
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold text-[#8899AA] hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth */}
        <AuthButton />
      </div>
    </nav>
  );
}
