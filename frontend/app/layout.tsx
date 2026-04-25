import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TrustMark – AI-Powered Digital Asset Protection",
  description:
    "Protect your creative work with AI-generated fingerprints, invisible watermarks, and immutable blockchain-style provenance records.",
  keywords: ["digital watermark", "copyright", "AI", "image protection", "NFT provenance"],
  openGraph: {
    title: "TrustMark",
    description: "AI-Powered Digital Asset Protection",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#F2F3D9] text-[#1a1c1e] antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
