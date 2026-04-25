"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ProvenanceRecord } from "@/lib/api";

export default function CertificatePage() {
  const params = useParams<{ id: string }>();
  const assetId = params?.id ?? "";

  const [record, setRecord] = useState<ProvenanceRecord | null>(null);
  // Start loading=false to prevent SSR/hydration mismatch.
  // We set it to true inside useEffect (client-only).
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mark as loading on the client
    setLoading(true);

    if (!assetId) {
      setError("Invalid certificate ID.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    // Abort after 10 seconds – avoids infinite loading when backend is down
    const timeout = setTimeout(() => controller.abort(), 10000);

    const fetchCert = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/api/v1/certificate/${assetId}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.detail ?? `HTTP ${res.status}`);
        }
        const data = await res.json();
        setRecord(data);
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Request timed out. The TrustMark API is currently unavailable.");
        } else if (err.message?.includes("Failed to fetch") || err.message?.includes("ERR_CONNECTION")) {
          setError("Could not connect to the TrustMark API. Please try again later.");
        } else {
          setError(err.message || "Certificate not found.");
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };
    fetchCert();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [assetId]);


  if (loading) {
    return <div className="text-center mt-32 text-gray-400">Loading certificate...</div>;
  }

  if (error || !record) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-[#0f1423] rounded-2xl border border-red-500/30 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Invalid Certificate</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold">
          ◈
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">TrustMark Certificate</h1>
          <p className="text-gray-400 text-sm">Verified Immutable Provenance Record</p>
        </div>
      </div>

      <div className="bg-[#0f1423] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-gray-800 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={record.watermarked_image_url} 
              alt={record.title || "Protected Asset"} 
              className="w-full aspect-square object-cover rounded-xl border border-gray-800"
            />
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Watermark Verified
              </span>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Asset Title</h2>
              <p className="text-xl font-semibold text-white">{record.title || "Untitled Asset"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Owner Email</h2>
                <p className="text-white break-all">{record.owner_email}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Registration Date</h2>
                <p className="text-white">{new Date(record.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">License Terms</h2>
              <div className="inline-block px-3 py-1 rounded bg-gray-800 text-gray-200 text-sm border border-gray-700">
                {record.license_type}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">AI Semantic Fingerprint (SHA-256)</h2>
              <p className="text-xs font-mono text-blue-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 break-all">
                {record.fingerprint}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0a0d16] p-6 flex justify-between items-center text-sm text-gray-500">
          <div>
            Asset ID: <span className="font-mono">{record.asset_id}</span>
          </div>
          <div>
            Verifications: <span className="text-white font-bold">{record.verification_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
