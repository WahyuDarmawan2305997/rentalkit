import type { Metadata } from "next";
import { Suspense } from "react";
import KatalogClient from "./KatalogClient";

export const metadata: Metadata = {
  title: "Katalog Barang",
  description:
    "Jelajahi katalog sewa kamera, tripod, mikrofon, printer, dan proyektor dari mahasiswa Bandung. Filter, cari, dan bandingkan harga dengan mudah.",
};

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "5rem 1.5rem", textAlign: "center", color: "var(--fg-muted)" }}>
          Memuat katalog...
        </div>
      }
    >
      <KatalogClient />
    </Suspense>
  );
}
