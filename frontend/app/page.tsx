"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ── tiny particle canvas ─────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; vx: number; vy: number; alpha: number };
    const particles: P[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,194,203,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      // draw faint lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,194,203,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ── Step card ───────────────────────────────────────────── */
function StepCard({
  num,
  title,
  desc,
  colorClass,
  delayClass,
}: {
  num: string;
  title: string;
  desc: string;
  colorClass: string;
  delayClass: string;
}) {
  return (
    <div className={`glass-card p-8 flex flex-col gap-4 animate-fade-up ${delayClass}`}>
      <div className={`text-5xl font-black opacity-25 font-[Space_Grotesk,sans-serif] ${colorClass}`}>
        {num}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-[#8899AA] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Feature pill ────────────────────────────────────────── */
function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-[#8899AA] hover:border-[#00C2CB]/30 hover:text-white transition-all">
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

/* ── Stat ────────────────────────────────────────────────── */
function Stat({
  value,
  label,
  colorClass,
}: {
  value: string;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="text-center">
      <p className={`text-4xl font-black font-[Space_Grotesk,sans-serif] ${colorClass}`}>
        {value}
      </p>
      <p className="text-xs text-[#8899AA] font-medium mt-1 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 text-center pb-20 pt-10">
        <ParticleCanvas />

        {/* Badge */}
        <div className="badge-teal mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C2CB] animate-ping" />
          Neural Integrity Protocol · v1.0
        </div>

        {/* Main heading */}
        <h1
          className="hero-title text-[clamp(4rem,12vw,9rem)] text-white mb-6 animate-fade-up animate-fade-up-1"
        >
          TRUST
          <br />
          <span className="text-gradient">MARK.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-2xl text-[#8899AA] font-medium mb-10 max-w-2xl leading-relaxed animate-fade-up animate-fade-up-2">
          Embed invisible{" "}
          <span className="text-[#00C2CB] font-semibold">AI fingerprints</span>{" "}
          into every digital asset. Prove ownership in{" "}
          <span className="text-[#FF6B9D] font-semibold">under 3 seconds</span>{" "}
          — anywhere, forever.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up animate-fade-up-3">
          <Link
            id="hero-protect-cta"
            href="/protect"
            className="btn-primary text-base px-8 py-4 min-w-[200px]"
          >
            Start Protecting
          </Link>
          <Link
            id="hero-verify-cta"
            href="/verify"
            className="btn-secondary text-base px-8 py-4 min-w-[200px]"
          >
            Verify Ownership
          </Link>
        </div>

        {/* Social proof numbers */}
        <div className="flex flex-wrap items-center justify-center gap-12 mb-8 animate-fade-up animate-fade-up-4">
          <Stat value="14K+" label="Assets Protected" colorClass="text-[#00C2CB]" />
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          <Stat value="99.7%" label="Verification Accuracy" colorClass="text-[#FF6B9D]" />
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          <Stat value="&lt;3s" label="Avg. Verify Time" colorClass="text-[#00C2CB]" />
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 animate-fade-up animate-fade-up-4">
          <FeaturePill icon="🤖" label="Gemini 1.5 Vision" />
          <FeaturePill icon="🔍" label="Vertex AI Search" />
          <FeaturePill icon="🔐" label="LSB Steganography" />
          <FeaturePill icon="🌐" label="No Crypto Needed" />
          <FeaturePill icon="⚖️" label="EU AI Act Ready" />
        </div>
      </section>

      <div className="divider my-0" />

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <div className="badge-teal mx-auto mb-6">How It Works</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Three steps. Total protection.
          </h2>
          <p className="text-[#8899AA] max-w-xl mx-auto">
            From upload to certified ownership in seconds — powered by Google
            AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            num="01"
            title="Analyze"
            desc="Gemini 1.5 Vision generates a unique semantic DNA for your work — a content-aware fingerprint that survives any modification."
            colorClass="text-[#00C2CB]"
            delayClass="animate-fade-up-1"
          />
          <StepCard
            num="02"
            title="Embed"
            desc="Your creator ID is woven directly into the image's binary code using DCT steganography — invisible to the eye, unbreakable to scanners."
            colorClass="text-[#E63E6D]"
            delayClass="animate-fade-up-2"
          />
          <StepCard
            num="03"
            title="Certify"
            desc="A public TrustMark Certificate is issued — a shareable URL + QR code that anyone can verify in real-time, no account needed."
            colorClass="text-[#00C2CB]"
            delayClass="animate-fade-up-3"
          />
        </div>
      </section>

      <div className="divider" />

      {/* ── WHY TRUSTMARK ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <div className="badge-teal mx-auto mb-6">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built different. Built to{" "}
            <span className="text-gradient">win.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Big feature */}
          <div className="glass-card glow-border p-10 flex flex-col gap-6 md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006D77] to-[#00C2CB] flex items-center justify-center text-2xl shadow-lg">
              🧬
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                AI Semantic Fingerprinting
              </h3>
              <p className="text-[#8899AA] leading-relaxed">
                Unlike basic EXIF metadata (trivially stripped in one click),
                TrustMark's Gemini-generated perceptual fingerprint is
                content-aware. It survives JPEG re-saves, Instagram filters,
                40% crops, color grading, and screenshot re-photography.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Crop-resistant", "Filter-proof", "Screenshot-safe"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs font-semibold rounded-full bg-[#00C2CB]/10 text-[#00C2CB] border border-[#00C2CB]/20"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="glass-card p-10 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E63E6D]/10 flex items-center justify-center text-xl border border-[#E63E6D]/20">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-white">
              Real-Time Reverse Search
            </h3>
            <p className="text-[#8899AA] text-sm leading-relaxed">
              Vertex AI Matching Engine stores all embeddings as 1408-dim
              vectors. Upload any suspected copy — TrustMark finds the original
              in under 3 seconds even if heavily modified.
            </p>
          </div>

          <div className="glass-card p-10 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00C2CB]/10 flex items-center justify-center text-xl border border-[#00C2CB]/20">
              🌍
            </div>
            <h3 className="text-xl font-bold text-white">No Crypto Required</h3>
            <p className="text-[#8899AA] text-sm leading-relaxed">
              Zero blockchain wallets, zero gas fees. Works in any browser for
              any creator. Protect up to 50 assets per month — completely free.
            </p>
          </div>

          <div className="glass-card p-10 flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-[#E63E6D]/10 flex items-center justify-center text-xl border border-[#E63E6D]/20">
              📜
            </div>
            <h3 className="text-xl font-bold text-white">
              Immutable Provenance Ledger
            </h3>
            <p className="text-[#8899AA] text-sm leading-relaxed">
              Every protection event is written to Firestore with a hash link to
              the previous state. Tamper-proof. Immutable. Auditable by anyone,
              anytime, forever.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── FINAL CTA ─────────────────────────────── */}
      <section className="px-6 py-28 text-center">
        <div className="max-w-3xl mx-auto glass-card p-14">
          <div className="badge-teal mx-auto mb-8">Free for Creators</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Protect your work{" "}
            <span className="text-gradient">right now.</span>
          </h2>
          <p className="text-[#8899AA] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Upload any image and get a TrustMark Certificate in seconds. Built
            with Gemini Vision. Powered by Google Cloud.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              id="footer-protect-cta"
              href="/protect"
              className="btn-primary text-base px-10 py-4"
            >
              Start Protecting — It&apos;s Free
            </Link>
            <Link
              id="footer-verify-cta"
              href="/verify"
              className="btn-secondary text-base px-10 py-4"
            >
              Verify an Asset
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8899AA]">
          <div className="flex items-center gap-2 font-bold text-white/60">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#00C2CB] to-[#E63E6D]" />
            TrustMark
          </div>
          <p>
            Built with Gemini Vision · Vertex AI · Firebase · Google Cloud Run
          </p>
          <p>© 2026 TrustMark · Google Solution Challenge</p>
        </div>
      </footer>
    </div>
  );
}
