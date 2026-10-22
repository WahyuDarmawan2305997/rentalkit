import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RentalKit — Sewa Peralatan Antar Mahasiswa Bandung",
    template: "%s | RentalKit",
  },
  description:
    "Platform peer-to-peer rental kamera, tripod, mikrofon, printer, dan proyektor antar mahasiswa di Bandung. Hemat, mudah, dan terpercaya.",
  keywords: [
    "sewa kamera mahasiswa Bandung",
    "rental tripod Bandung",
    "sewa proyektor mahasiswa",
    "rental peralatan kuliah",
    "RentalKit",
  ],
  openGraph: {
    siteName: "RentalKit",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
