import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "TrustMark – AI-Powered Digital Asset Protection",
  description:
    "Protect your creative work with invisible AI watermarks and immutable provenance. Built with Gemini Vision + Vertex AI.",
  keywords: [
    "digital watermark",
    "copyright protection",
    "AI fingerprint",
    "image ownership",
    "provenance certificate",
    "Gemini Vision",
    "content authenticity",
  ],
  openGraph: {
    title: "TrustMark – Protect What You Create",
    description:
      "AI-powered digital asset protection. Embed. Certify. Verify.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050D1A] text-[#EDF2F7] antialiased">
        {/* Animated mesh background */}
        <div className="mesh-bg" aria-hidden="true">
          <div className="mesh-orb" />
          <div className="mesh-orb" />
          <div className="mesh-orb" />
        </div>
        {/* Subtle grid overlay */}
        <div className="grid-overlay fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
