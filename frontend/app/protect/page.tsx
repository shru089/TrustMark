"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { protectAsset } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProtectPage() {
  const { user, login } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProtect = async () => {
    if (!file || !title) return;
    setLoading(true);
    try {
      // Default to standard license for hackathon demo
      const res = await protectAsset(file, "CC-BY-4.0", title, description);
      router.push(`/cert/${res.asset_id}`);
    } catch (error) {
      console.error("Protection failed:", error);
      alert("Failed to protect asset. Make sure the backend is running and you are signed in.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="liquid-card p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#922D50]/10 flex items-center justify-center text-[#922D50] text-3xl mb-8 mx-auto">
            🔒
          </div>
          <h2 className="text-3xl font-black mb-6">Access Restricted</h2>
          <p className="text-gray-400 mb-10 font-medium">Please sign in to start protecting your creative assets with TrustMark.</p>
          <button onClick={login} className="btn-liquid-primary w-full">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#006D77]/10 blur-[100px] -z-10" />
      
      <div className="mb-16">
        <h1 className="text-5xl font-black mb-4 liquid-text-gradient tracking-tight">Protect Asset</h1>
        <p className="text-gray-400 text-lg font-medium">Embed your digital signature and generate a semantic AI fingerprint.</p>
      </div>

      <div className="grid md:grid-cols-1 gap-12">
        <div className="liquid-card p-10">
          <div className="space-y-8">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Asset File (PNG recommended)
              </label>
              <div 
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${
                  file ? 'border-[#006D77] bg-[#006D77]/5' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="asset-upload"
                  accept="image/*"
                />
                <label htmlFor="asset-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4">📄</div>
                      <p className="text-[#006D77] font-bold text-lg">{file.name}</p>
                      <p className="text-gray-500 text-sm mt-2 font-medium">Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4 text-gray-600">📤</div>
                      <p className="text-gray-300 font-bold text-lg">Click or drag to upload asset</p>
                      <p className="text-gray-500 text-sm mt-2 font-medium">Supports PNG, JPG, JPEG (Max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="asset-title" className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Asset Title
                </label>
                <input
                  id="asset-title"
                  type="text"
                  placeholder="e.g. Sunset in Neo-Tokyo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="liquid-input text-lg"
                />
              </div>

              <div>
                <label htmlFor="asset-description" className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Description
                </label>
                <textarea
                  id="asset-description"
                  placeholder="Describe your creative work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="liquid-input h-32 text-lg resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleProtect}
              disabled={loading || !file || !title}
              className={`btn-liquid-primary w-full py-5 text-xl tracking-tight ${
                loading || !file || !title ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Fluid ID...
                </span>
              ) : (
                'Secure Asset Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
