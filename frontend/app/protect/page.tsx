"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { protectAsset } from "@/lib/api";
import { useRouter } from "next/navigation";

const LICENSE_OPTIONS = [
  { id: "CC-BY-4.0", label: "CC BY 4.0", desc: "Free with attribution" },
  { id: "CC-BY-NC-4.0", label: "CC BY-NC", desc: "Non-commercial only" },
  { id: "All Rights Reserved", label: "All Rights Reserved", desc: "Full copyright" },
];

export default function ProtectPage() {
  const { user, login } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [license, setLicense] = useState("CC-BY-4.0");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "analyzing" | "embedding" | "writing">("idle");
  const router = useRouter();

  const handleFileChange = useCallback((file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  const handleProtect = async () => {
    if (!file || !title) return;
    setLoading(true);
    try {
      setStep("analyzing");
      await new Promise((r) => setTimeout(r, 600));
      setStep("embedding");
      await new Promise((r) => setTimeout(r, 600));
      setStep("writing");
      const res = await protectAsset(file, license, title, description);
      router.push(`/cert/${res.asset_id}`);
    } catch (error) {
      console.error("Protection failed:", error);
      alert(
        "Failed to protect asset. Make sure the backend is running and you are signed in."
      );
    } finally {
      setLoading(false);
      setStep("idle");
    }
  };

  const stepLabel = {
    idle: "Secure Asset Now",
    analyzing: "Gemini analyzing...",
    embedding: "Embedding watermark...",
    writing: "Writing provenance record...",
  }[step];

  /* ── Not signed in ─── */
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="glass-card glow-border max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[#E63E6D]/10 border border-[#E63E6D]/20 flex items-center justify-center text-4xl mx-auto mb-8">
            🔒
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-[#8899AA] mb-8 leading-relaxed">
            Sign in with Google to start protecting your creative assets with
            TrustMark.
          </p>
          <button
            id="protect-signin-btn"
            onClick={login}
            className="btn-primary w-full py-4 text-base"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  /* ── Main ─── */
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="badge-teal mb-6">Asset Protection</div>
        <h1 className="text-5xl font-bold text-white mb-3">
          Protect Your <span className="text-gradient">Asset</span>
        </h1>
        <p className="text-[#8899AA] text-lg">
          Embed your digital signature and generate a semantic AI fingerprint.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: form */}
        <div className="glass-card p-8 space-y-8">
          {/* Upload zone */}
          <div>
            <label className="block text-xs font-bold text-[#8899AA] uppercase tracking-widest mb-3">
              Asset File
            </label>
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
                file
                  ? "border-[#00C2CB]/50 bg-[#00C2CB]/[0.04]"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <input
                type="file"
                onChange={onInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
                id="asset-upload"
                accept="image/*"
                aria-label="Upload asset file"
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">✅</span>
                  <p className="text-[#00C2CB] font-semibold">{file.name}</p>
                  <p className="text-[#8899AA] text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · Click to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl">
                    📤
                  </div>
                  <p className="text-white font-semibold">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-[#8899AA] text-xs">
                    PNG, JPG, JPEG · Max 10 MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="asset-title"
              className="block text-xs font-bold text-[#8899AA] uppercase tracking-widest mb-3"
            >
              Asset Title
            </label>
            <input
              id="asset-title"
              type="text"
              placeholder="e.g. Sunset in Neo-Tokyo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="tm-input"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="asset-description"
              className="block text-xs font-bold text-[#8899AA] uppercase tracking-widest mb-3"
            >
              Description <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea
              id="asset-description"
              placeholder="Describe your creative work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="tm-input h-28 resize-none"
            />
          </div>

          {/* License */}
          <div>
            <p className="block text-xs font-bold text-[#8899AA] uppercase tracking-widest mb-3">
              License Type
            </p>
            <div className="grid grid-cols-3 gap-3">
              {LICENSE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLicense(opt.id)}
                  className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all text-sm ${
                    license === opt.id
                      ? "border-[#00C2CB] bg-[#00C2CB]/[0.08] text-white"
                      : "border-white/10 bg-white/[0.02] text-[#8899AA] hover:border-white/20"
                  }`}
                >
                  <span className="font-bold">{opt.label}</span>
                  <span className="text-[10px] opacity-70">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            id="protect-submit-btn"
            onClick={handleProtect}
            disabled={loading || !file || !title}
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
                {stepLabel}
              </span>
            ) : (
              stepLabel
            )}
          </button>
        </div>

        {/* Right: preview + info */}
        <div className="space-y-6">
          {/* Image preview */}
          <div className="glass-card p-4 overflow-hidden">
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

          {/* Info boxes */}
          <div className="glass-card p-6 space-y-4 text-sm">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-3">
              What happens next?
            </h3>
            {[
              ["🤖", "Gemini Vision analyzes your asset"],
              ["🔐", "LSB watermark embeds your creator ID"],
              ["🗄️", "Provenance written to Firestore ledger"],
              ["📜", "Certificate URL + QR code generated"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-start gap-3 text-[#8899AA]">
                <span className="text-base mt-0.5">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
