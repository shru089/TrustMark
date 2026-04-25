"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ProvenanceRecord } from "@/lib/api";

export default function CertificatePage() {
  const params = useParams<{ id: string }>();
  const assetId = params?.id ?? "";

  const [record, setRecord] = useState<ProvenanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    if (!assetId) {
      setError("Invalid certificate ID.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
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
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#006D77]/30 border-t-[#006D77] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="liquid-card p-12 max-w-md w-full text-center">
          <div className="text-5xl mb-6">❌</div>
          <h2 className="text-2xl font-black text-[#922D50] mb-4">Invalid Certificate</h2>
          <p className="text-gray-500 font-medium">{error || "Certificate not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006D77] to-[#922D50] shadow-lg flex items-center justify-center text-white text-2xl font-black">
          ◈
        </div>
        <div>
          <h1 className="text-3xl font-black liquid-text-gradient">TrustMark Certificate</h1>
          <p className="text-gray-400 text-sm font-medium">Verified Immutable Provenance Record</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="liquid-card overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={record.watermarked_image_url}
              alt={record.title || "Protected Asset"}
              className="w-full aspect-square object-cover rounded-2xl border border-white/60"
            />
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#006D77]/10 text-[#006D77] text-xs font-bold border border-[#006D77]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006D77] animate-pulse"></span>
                Watermark Verified
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Asset Title</h2>
              <p className="text-2xl font-black text-[#1A1C1E]">{record.title || "Untitled Asset"}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Owner Email</h2>
                <p className="text-[#1A1C1E] font-semibold break-all">{record.owner_email}</p>
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registration Date</h2>
                <p className="text-[#1A1C1E] font-semibold">{new Date(record.created_at).toLocaleString()}</p>
              </div>
            </div>

            {record.description && (
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</h2>
                <p className="text-gray-600 font-medium">{record.description}</p>
              </div>
            )}

            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">License Terms</h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#006D77]/10 text-[#006D77] text-sm font-bold border border-[#006D77]/20">
                {record.license_type}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI Semantic Fingerprint (SHA-256)</h2>
              <p className="text-xs font-mono text-[#006D77] bg-[#006D77]/5 p-3 rounded-xl border border-[#006D77]/10 break-all">
                {record.fingerprint}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#006D77]/5 border-t border-[#006D77]/10 p-6 flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            Asset ID: <span className="font-mono text-[#1A1C1E] font-medium">{record.asset_id}</span>
          </div>
          <div>
            Verifications: <span className="text-[#006D77] font-black text-base">{record.verification_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
