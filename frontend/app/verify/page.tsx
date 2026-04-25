"use client";

import { useState } from "react";
import { verifyAsset, type VerifyResponse } from "@/lib/api";
import Link from "next/link";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 relative">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#922D50]/10 blur-[100px] -z-10" />

      <div className="mb-16">
        <h1 className="text-5xl font-black mb-4 liquid-text-gradient tracking-tight">Verify Ownership</h1>
        <p className="text-gray-400 text-lg font-medium">Scan an image to detect invisible watermarks and semantic fingerprints.</p>
      </div>

      <div className="grid md:grid-cols-1 gap-12">
        <div className="liquid-card p-10">
          <div className="space-y-8">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Target Image to Verify
              </label>
              <div 
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${
                  file ? 'border-[#C16E70] bg-[#C16E70]/5' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="asset-verify"
                  accept="image/*"
                />
                <label htmlFor="asset-verify" className="cursor-pointer">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-[#C16E70] font-bold text-lg">{file.name}</p>
                      <p className="text-gray-500 text-sm mt-2 font-medium">Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4 text-gray-600">📸</div>
                      <p className="text-gray-300 font-bold text-lg">Click or drag to verify asset</p>
                      <p className="text-gray-500 text-sm mt-2 font-medium">Supports all common image formats</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || !file}
              className={`btn-liquid-primary w-full py-5 text-xl tracking-tight ${
                loading || !file ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
            >
              {loading ? 'Analyzing Neural Fingerprint...' : 'Verify Authenticity'}
            </button>

            {/* Verification Results */}
            {result && (
              <div className={`mt-8 p-8 rounded-[1.5rem] border animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                result.match_found 
                  ? 'bg-[#006D77]/10 border-[#006D77]/30' 
                  : 'bg-[#922D50]/10 border-[#922D50]/30'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${result.match_found ? 'text-[#006D77]' : 'text-[#922D50]'}`}>
                    {result.match_found ? '✅' : '❌'}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${result.match_found ? 'text-white' : 'text-white'}`}>
                      {result.match_found ? 'Match Found!' : 'No Matching Record'}
                    </h3>
                    <p className="text-gray-400 mb-4 font-medium">{result.message}</p>
                    
                    {result.match_found && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-500 uppercase font-bold tracking-widest text-[10px]">Owner</span>
                            <span className="text-white font-semibold">{result.owner_email}</span>
                          </div>
                          <div>
                            <span className="block text-gray-500 uppercase font-bold tracking-widest text-[10px]">Confidence</span>
                            <span className="text-white font-semibold">{(result.confidence_score * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <Link 
                          href={result.certificate_url || '#'} 
                          className="inline-block bg-[#006D77] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#005a63] transition-colors"
                        >
                          View Official Certificate
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
