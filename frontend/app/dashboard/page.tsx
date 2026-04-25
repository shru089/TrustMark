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
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="liquid-card p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#006D77]/10 flex items-center justify-center text-[#006D77] text-3xl mb-8 mx-auto">📊</div>
          <h2 className="text-3xl font-black mb-6">Authentication Required</h2>
          <p className="text-gray-500 mb-4 font-medium">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-32 text-gray-500 font-medium">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-32 text-[#922D50] font-bold">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 pb-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2 liquid-text-gradient">Creator Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage your protected assets and verification stats.</p>
        </div>
        <Link
          href="/protect"
          className="btn-liquid-primary px-8 py-3 text-base"
        >
          Protect New Asset
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="liquid-card p-8">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Total Protected</h3>
          <p className="text-4xl font-black text-[#006D77]">{data?.total || 0}</p>
        </div>
        <div className="liquid-card p-8">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Total Verifications</h3>
          <p className="text-4xl font-black text-[#922D50]">
            {data?.assets.reduce((sum, a) => sum + a.verification_count, 0) || 0}
          </p>
        </div>
        <div className="liquid-card p-8">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Account Status</h3>
          <p className="text-xl font-black text-[#006D77] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006D77] animate-pulse block"></span> Active
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-6 border-b border-[#006D77]/10 pb-4">Your Portfolio</h2>

      {data?.assets.length === 0 ? (
        <div className="liquid-card text-center py-20">
          <p className="text-gray-500 mb-4 font-medium">You haven&apos;t protected any assets yet.</p>
          <Link href="/protect" className="text-[#006D77] hover:text-[#922D50] transition font-bold">Get started →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.assets.map((asset) => (
            <div key={asset.asset_id} className="liquid-card overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-100 relative rounded-t-[3rem] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.watermarked_image_url}
                  alt={asset.title || "Asset"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#006D77] border border-[#006D77]/20">
                  {asset.license_type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-lg text-[#1A1C1E] mb-1 truncate">{asset.title || "Untitled"}</h3>
                <p className="text-xs text-gray-400 mb-4 font-medium">{new Date(asset.created_at).toLocaleDateString()}</p>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm">
                    <span className="text-gray-400 font-medium">Verifications: </span>
                    <span className="text-[#006D77] font-black">{asset.verification_count}</span>
                  </div>
                  <Link
                    href={`/cert/${asset.asset_id}`}
                    className="text-sm text-white bg-[#006D77] hover:bg-[#922D50] px-4 py-1.5 rounded-full transition font-bold"
                  >
                    Certificate
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
