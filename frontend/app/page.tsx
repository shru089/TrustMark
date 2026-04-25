import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-20 px-4 text-center relative overflow-hidden bg-[#F2F3D9]">
      {/* Dynamic Background Blobs */}
      <div className="blob animate-liquid top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#006D77]" />
      <div className="blob animate-liquid bottom-[-10%] right-[-20%] w-[700px] h-[700px] bg-[#922D50]" />
      <div className="blob animate-liquid top-[30%] right-[-10%] w-[500px] h-[500px] bg-[#DC9E82]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/40 backdrop-blur-xl text-[#006D77] text-sm font-black mb-12 border border-white shadow-xl">
          <span className="w-3 h-3 rounded-full bg-[#006D77] animate-ping" />
          Neural Integrity Protocol v1.0
        </div>
        
        <h1 className="liquid-text-hero mb-12">
          TRUST<br/>
          <span className="accent-gradient">MARK.</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-800 mb-16 max-w-4xl mx-auto leading-tight font-bold tracking-tight">
          Protect your creation with <span className="text-[#006D77]">AI Fingerprints</span> and <span className="text-[#922D50]">Invisible Identity</span>. Pure ownership, semantically secured.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 mb-40 justify-center items-center">
          <Link 
            href="/protect" 
            className="btn-liquid min-w-[280px]"
          >
            Start Protecting
          </Link>
          <Link 
            href="/verify" 
            className="btn-liquid-secondary min-w-[280px] backdrop-blur-md"
          >
            Verify Authenticity
          </Link>
        </div>

        {/* Liquid Bento Grid */}
        <div className="grid md:grid-cols-3 gap-12 w-full text-left">
          <div className="liquid-card p-12">
            <div className="text-[#006D77] text-5xl font-black mb-8 opacity-40">01</div>
            <h3 className="text-3xl font-black text-[#1A1C1E] mb-6">Analyze</h3>
            <p className="text-xl text-gray-700 font-bold leading-snug">Gemini 1.5 Vision generates a unique semantic DNA for your work that survives any modification.</p>
          </div>
          
          <div className="liquid-card p-12">
            <div className="text-[#922D50] text-5xl font-black mb-8 opacity-40">02</div>
            <h3 className="text-3xl font-black text-[#1A1C1E] mb-6">Woven ID</h3>
            <p className="text-xl text-gray-700 font-bold leading-snug">Embed your signature directly into the image's binary code, invisible to the eye but detectable by our scan.</p>
          </div>
          
          <div className="liquid-card p-12">
            <div className="text-[#DC9E82] text-5xl font-black mb-8 opacity-40">03</div>
            <h3 className="text-3xl font-black text-[#1A1C1E] mb-6">Verify</h3>
            <p className="text-xl text-gray-700 font-bold leading-snug">Instantly check any asset against the global registry to prove its provenance and origin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
