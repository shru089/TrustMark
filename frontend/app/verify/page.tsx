"use client";

import { useState, useCallback } from "react";
import { verifyAsset, type VerifyResponse } from "@/lib/api";
import Link from "next/link";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyAsset(file);
      setResult(res);
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Failed to verify asset. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const confidencePct = result ? Math.round(result.confidence_score * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="badge-teal mb-6">Ownership Verification</div>
        <h1 className="text-5xl font-bold text-white mb-3">
          Verify <span className="text-gradient">Authenticity</span>
        </h1>
        <p className="text-[#8899AA] text-lg">
          Scan any image to detect invisible watermarks and semantic fingerprints.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: upload + button */}
        <div className="glass-card p-8 space-y-8">
          {/* Upload */}
          <div>
            <label className="block text-xs font-bold text-[#8899AA] uppercase tracking-widest mb-3">
              Target Image
            </label>
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                file
                  ? "border-[#E63E6D]/50 bg-[#E63E6D]/[0.03]"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <input
                type="file"
                onChange={onInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
                id="asset-verify"
                accept="image/*"
                aria-label="Upload image to verify"
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  <p className="text-[#E63E6D] font-semibold">{file.name}</p>
                  <p className="text-[#8899AA] text-xs">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <p className="text-white font-semibold">
                    Drop any image to verify
                  </p>
                  <p className="text-[#8899AA] text-xs">
                    Works with originals, filtered copies, crops, screenshots
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            id="verify-submit-btn"
            onClick={handleVerify}
            disabled={loading || !file}
            className="btn-primary w-full py-4 text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing Neural Fingerprint...
              </span>
            ) : (
              "Verify Authenticity"
            )}
          </button>

          {/* Results */}
          {result && (
            <div
              className={`mt-2 p-6 rounded-2xl border transition-all ${
                result.match_found
                  ? "bg-[#00C2CB]/[0.05] border-[#00C2CB]/20"
                  : "bg-[#E63E6D]/[0.05] border-[#E63E6D]/20"
              }`}
            >
              {/* Status line */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    result.match_found
                      ? "bg-[#00C2CB]/10"
                      : "bg-[#E63E6D]/10"
                  }`}
                >
                  {result.match_found ? "✅" : "⚠️"}
                </div>
                <div>
                  <p
                    className={`font-bold text-lg ${
                      result.match_found ? "text-[#00C2CB]" : "text-[#E63E6D]"
                    }`}
                  >
                    {result.match_found ? "Match Found!" : "No Registry Match"}
                  </p>
                  <p className="text-[#8899AA] text-xs">{result.message}</p>
                </div>
              </div>

              {result.match_found && (
                <div className="space-y-4">
                  {/* Confidence bar */}
                  <div>
                    <div className="flex justify-between text-xs text-[#8899AA] mb-1">
                      <span>Match Confidence</span>
                      <span className="text-[#00C2CB] font-bold">
                        {confidencePct}%
                      </span>
                    </div>
                    <div className="confidence-bar">
                      <style>{`.dynamic-width { width: ${confidencePct}%; }`}</style>
                      <div className="confidence-fill dynamic-width" />
                    </div>
                  </div>

                  {/* Owner & date */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[#8899AA] uppercase tracking-widest mb-1 font-bold">
                        Owner
                      </p>
                      <p className="text-white font-medium truncate">
                        {result.owner_email}
                      </p>
                    </div>
                    {result.created_at && (
                      <div>
                        <p className="text-[#8899AA] uppercase tracking-widest mb-1 font-bold">
                          Registered
                        </p>
                        <p className="text-white font-medium">
                          {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <Link
                    href={result.certificate_url || "#"}
                    className="btn-primary text-xs px-5 py-2.5 inline-flex"
                  >
                    View Official Certificate →
                  </Link>
                </div>
              )}

              {!result.match_found && (
                <Link
                  href="/protect"
                  className="btn-secondary text-xs px-5 py-2.5 inline-flex mt-2"
                >
                  Register this asset instead →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right: preview + how it works */}
        <div className="space-y-6">
          <div className="glass-card p-4">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-xl object-cover max-h-64"
              />
            ) : (
              <div className="w-full h-48 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8899AA] text-sm">
                Preview appears here
              </div>
            )}
          </div>

          <div className="glass-card p-6 text-sm space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-3">
              What we check
            </h3>
            {[
              ["🧬", "LSB steganographic watermark"],
              ["🤖", "Gemini semantic fingerprint"],
              ["🔍", "Vertex AI vector similarity"],
              ["🛡️", "Tamper detection markers"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-start gap-3 text-[#8899AA]">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
