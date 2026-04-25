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
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-[#0f1423] rounded-2xl border border-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-gray-400 mb-6">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-32 text-gray-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-32 text-red-400">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-gray-400">Manage your protected assets and view verification stats.</p>
        </div>
        <Link 
          href="/protect" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          Protect New Asset
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0f1423] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Protected Assets</h3>
          <p className="text-4xl font-bold text-white">{data?.total || 0}</p>
        </div>
        <div className="bg-[#0f1423] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Verifications</h3>
          <p className="text-4xl font-bold text-blue-400">
            {data?.assets.reduce((sum, a) => sum + a.verification_count, 0) || 0}
          </p>
        </div>
        <div className="bg-[#0f1423] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Account Status</h3>
          <p className="text-xl font-semibold text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 block"></span> Active
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Your Portfolio</h2>

      {data?.assets.length === 0 ? (
        <div className="text-center py-20 bg-[#0f1423] rounded-2xl border border-gray-800 border-dashed">
          <p className="text-gray-500 mb-4">You haven&apos;t protected any assets yet.</p>
          <Link href="/protect" className="text-blue-400 hover:text-blue-300 transition">Get started →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.assets.map((asset) => (
            <div key={asset.asset_id} className="bg-[#0f1423] rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition group">
              <div className="aspect-[4/3] bg-gray-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={asset.watermarked_image_url} 
                  alt={asset.title || "Asset"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white border border-white/10">
                  {asset.license_type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-white mb-1 truncate">{asset.title || "Untitled"}</h3>
                <p className="text-xs text-gray-500 mb-4">{new Date(asset.created_at).toLocaleDateString()}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm">
                    <span className="text-gray-400">Verifications: </span>
                    <span className="text-blue-400 font-bold">{asset.verification_count}</span>
                  </div>
                  <Link 
                    href={`/cert/${asset.asset_id}`}
                    className="text-sm text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition"
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
