"use client";

import { useEffect, useState } from "react";
import { getDashboard, type DashboardResponse } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="glass-card glow-border max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/20 flex items-center justify-center text-4xl mx-auto mb-8">
            📊
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-[#8899AA] mb-8 leading-relaxed">
            Please sign in to view your secure creator dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#00C2CB] animate-spin mb-4" />
        <p className="text-[#8899AA] text-sm animate-pulse">
          Loading secure dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-32 text-[#E63E6D] font-bold bg-[#E63E6D]/10 py-4 px-6 rounded-2xl inline-block">
        {error}
      </div>
    );
  }

  const totalVerifications =
    data?.assets.reduce((sum, a) => sum + a.verification_count, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="badge-teal mb-4">Creator Console</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Intelligence <span className="text-gradient">Hub</span>
          </h1>
          <p className="text-[#8899AA]">
            Manage your registered assets, track verifications, and monitor
            provenance.
          </p>
        </div>
        <Link
          href="/protect"
          className="btn-primary text-sm px-6 py-3 whitespace-nowrap"
        >
          + Protect New Asset
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="stat-card group">
          <h3 className="text-[#8899AA] text-xs font-bold uppercase tracking-widest mb-3">
            Total Protected Assets
          </h3>
          <div className="text-5xl font-[Space_Grotesk,sans-serif] font-black text-white group-hover:text-[#00C2CB] transition-colors">
            {data?.total || 0}
          </div>
        </div>
        <div className="stat-card group">
          <h3 className="text-[#8899AA] text-xs font-bold uppercase tracking-widest mb-3">
            Global Verifications
          </h3>
          <div className="text-5xl font-[Space_Grotesk,sans-serif] font-black text-white group-hover:text-[#E63E6D] transition-colors">
            {totalVerifications}
          </div>
        </div>
        <div className="stat-card">
          <h3 className="text-[#8899AA] text-xs font-bold uppercase tracking-widest mb-3">
            System Status
          </h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2CB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00C2CB]"></span>
            </div>
            <span className="text-white font-medium">Neural Net Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8 border-b border-white/[0.06] pb-4">
        <h2 className="text-2xl font-bold text-white">Asset Registry</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#8899AA] text-xs font-bold">
          {data?.assets.length || 0}
        </span>
      </div>

      {/* Empty state */}
      {data?.assets.length === 0 ? (
        <div className="glass-card text-center py-24 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center text-3xl mb-4">
            📦
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No assets yet</h3>
          <p className="text-[#8899AA] mb-6 max-w-sm">
            Your protected portfolio is empty. Register your first piece of
            content to start tracking its provenance.
          </p>
          <Link href="/protect" className="btn-secondary text-sm">
            Get Started
          </Link>
        </div>
      ) : (
        /* Asset grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.assets.map((asset) => (
            <div
              key={asset.asset_id}
              className="glass-card overflow-hidden group flex flex-col"
            >
              {/* Image container */}
              <div className="aspect-[4/3] bg-black/40 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.watermarked_image_url}
                  alt={asset.title || "Asset"}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                  {asset.license_type}
                </div>
                {/* ID badge overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="font-mono text-xs text-[#00C2CB] bg-[#00C2CB]/10 px-3 py-1 rounded-md border border-[#00C2CB]/20">
                    ID: {asset.asset_id.split("-")[0]}...
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-white mb-1 truncate">
                  {asset.title || "Untitled"}
                </h3>
                <p className="text-xs text-[#8899AA] mb-6">
                  {new Date(asset.created_at).toLocaleDateString()}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00C2CB]" />
                    <span className="text-xs text-[#8899AA] font-medium">
                      Verifications:{" "}
                      <span className="text-white">
                        {asset.verification_count}
                      </span>
                    </span>
                  </div>
                  <Link
                    href={`/cert/${asset.asset_id}`}
                    className="text-xs font-bold text-[#00C2CB] hover:text-white transition-colors"
                  >
                    View Cert →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
