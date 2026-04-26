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
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
          }/api/v1/certificate/${assetId}`,
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
          setError("Request timed out. The API is currently unavailable.");
        } else if (
          err.message?.includes("Failed to fetch") ||
          err.message?.includes("ERR_CONNECTION")
        ) {
          setError("Could not connect to the API. Please try again later.");
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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#00C2CB] animate-spin mx-auto mb-4" />
          <p className="text-[#8899AA] font-medium animate-pulse">
            Retrieving provenance ledger...
          </p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-12 text-center">
          <div className="text-5xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-[#E63E6D] mb-4">
            Invalid Certificate
          </h2>
          <p className="text-[#8899AA]">{error || "Certificate not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C2CB] to-[#E63E6D] shadow-[0_0_30px_rgba(0,194,203,0.3)] flex items-center justify-center text-white text-3xl font-black">
          🛡️
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Provenance <span className="text-gradient">Certificate</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2CB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C2CB]"></span>
            </span>
            <p className="text-[#00C2CB] text-sm font-semibold tracking-wide uppercase">
              Verified Immutable Record
            </p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Left: Image & primary details */}
        <div className="space-y-8">
          <div className="glass-card p-6 border-[#00C2CB]/20">
            {/* Image viewer */}
            <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-auto mb-6 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={record.watermarked_image_url}
                alt={record.title || "Protected Asset"}
                className="w-full h-auto max-h-[600px] object-contain group-hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Watermark overlay marker */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-[#00C2CB] animate-pulse" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">
                  Steganographic ID Embedded
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-[#8899AA] text-xs font-bold uppercase tracking-widest mb-2">
                  Asset Title
                </h2>
                <p className="text-3xl font-bold text-white">
                  {record.title || "Untitled Asset"}
                </p>
              </div>

              {record.description && (
                <div>
                  <h2 className="text-[#8899AA] text-xs font-bold uppercase tracking-widest mb-2">
                    Description
                  </h2>
                  <p className="text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                    {record.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Technical info */}
        <div className="space-y-6">
          <div className="glass-card glow-border p-8">
            <h3 className="text-white font-bold text-lg mb-6 border-b border-white/[0.06] pb-4">
              Cryptographic Ledger
            </h3>

            <div className="space-y-6 text-sm">
              <div>
                <h4 className="text-[#8899AA] text-[10px] font-bold uppercase tracking-widest mb-1">
                  Registered Owner
                </h4>
                <p className="text-white font-medium break-all bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.05]">
                  {record.owner_email}
                </p>
              </div>

              <div>
                <h4 className="text-[#8899AA] text-[10px] font-bold uppercase tracking-widest mb-1">
                  Timestamp (UTC)
                </h4>
                <p className="text-white font-mono bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.05]">
                  {new Date(record.created_at).toISOString().replace("T", " ")}
                </p>
              </div>

              <div>
                <h4 className="text-[#8899AA] text-[10px] font-bold uppercase tracking-widest mb-1">
                  License Terms
                </h4>
                <div className="inline-block bg-[#00C2CB]/10 text-[#00C2CB] px-3 py-1.5 rounded-md font-bold border border-[#00C2CB]/20">
                  {record.license_type}
                </div>
              </div>

              <div>
                <h4 className="text-[#8899AA] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Semantic AI Fingerprint</span>
                  <span className="text-[#E63E6D] lowercase font-mono">
                    SHA-256
                  </span>
                </h4>
                <p className="text-[#00C2CB] font-mono text-[11px] leading-relaxed break-all bg-[#00C2CB]/[0.05] p-3 rounded-lg border border-[#00C2CB]/10 selection:bg-[#00C2CB] selection:text-white">
                  {record.fingerprint}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-[#8899AA] text-[10px] font-bold uppercase tracking-widest mb-1">
                Global Verifications
              </p>
              <p className="text-3xl font-black text-white font-[Space_Grotesk,sans-serif]">
                {record.verification_count}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center text-xl">
              👁️
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#8899AA] mb-3">
              Asset ID:{" "}
              <span className="font-mono text-white/60">
                {record.asset_id}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
