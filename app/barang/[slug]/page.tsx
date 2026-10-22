import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { barangList, getBarangBySlug } from "@/lib/data";
import BarangDetailClient from "./BarangDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return barangList.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const barang = getBarangBySlug(slug);
  if (!barang) return { title: "Barang Tidak Ditemukan" };
  return {
    title: barang.name,
    description: `Sewa ${barang.name} di ${barang.location}. Kondisi: ${barang.condition}. Harga mulai Rp ${barang.pricePerDay.toLocaleString("id-ID")}/hari.`,
  };
}

export default async function BarangDetailPage({ params }: Props) {
  const { slug } = await params;
  const barang = getBarangBySlug(slug);
  if (!barang) notFound();

  return (
    <>
      {/* Back button */}
      <div style={{ padding: "1rem 1.5rem 0", maxWidth: "1280px", margin: "0 auto" }}>
        <Link
          href="/katalog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--fg-muted)",
            padding: "0.375rem 0.75rem",
            borderRadius: "var(--r-btn)",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            transition: "border-color var(--dur-fast)",
          }}
        >
          <ArrowLeft size={14} />
          Kembali ke Katalog
        </Link>
      </div>

      <BarangDetailClient barang={barang} />
    </>
  );
}
