import type { Metadata } from "next";
import Link from "next/link";
import {
  MagnifyingGlass,
  Camera,
  Aperture,
  Microphone,
  Printer,
  ProjectorScreen,
  ArrowRight,
  CheckCircle,
  HandCoins,
  ShieldCheck,
  Users,
  ChatCircle,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import { getFeaturedBarang } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "RentalKit — Sewa Peralatan Antar Mahasiswa Bandung",
};

const categories = [
  {
    icon: Camera,
    label: "Kamera",
    slug: "kamera",
    desc: "Mirrorless, DSLR, action cam",
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    icon: Aperture,
    label: "Tripod",
    slug: "tripod",
    desc: "Full-size, mini, fleksibel",
    color: "#0284c7",
    bg: "#e0f2fe",
  },
  {
    icon: Microphone,
    label: "Mikrofon",
    slug: "mikrofon",
    desc: "Shotgun, lavalier, kondenser",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    icon: Printer,
    label: "Printer",
    slug: "printer",
    desc: "Inkjet, laser, all-in-one",
    color: "#d97706",
    bg: "#fef3c7",
  },
  {
    icon: ProjectorScreen,
    label: "Proyektor",
    slug: "proyektor",
    desc: "Portable, mini, full HD",
    color: "#db2777",
    bg: "#fce7f3",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Cari & Pilih",
    desc: "Temukan barang yang kamu butuhkan dari katalog lengkap. Filter berdasarkan kategori, harga, dan lokasi.",
    icon: MagnifyingGlass,
  },
  {
    step: "02",
    title: "Ajukan Sewa",
    desc: "Tentukan tanggal mulai dan selesai, lihat total biaya otomatis, lalu ajukan permintaan sewa.",
    icon: CheckCircle,
  },
  {
    step: "03",
    title: "Ambil & Gunakan",
    desc: "Koordinasikan pengambilan langsung dengan pemilik. Gunakan barang, kembalikan tepat waktu.",
    icon: HandCoins,
  },
];

export default function HomePage() {
  const featured = getFeaturedBarang(6);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────── */}
      <section
        style={{
          minHeight: "min(90dvh, 700px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          alignItems: "stretch",
          overflow: "hidden",
        }}
        className="hero-grid"
      >
        {/* Left: copy */}
        <div
          style={{
            padding: "5rem 3rem 5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "680px",
          }}
          className="hero-copy"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "var(--accent-light)",
              color: "var(--accent)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              padding: "0.375rem 0.75rem",
              borderRadius: "999px",
              width: "fit-content",
              marginBottom: "1.5rem",
            }}
            className="animate-fade-up"
          >
            <Users size={14} weight="bold" />
            Peer-to-peer · Mahasiswa Bandung
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              marginBottom: "1.25rem",
            }}
            className="animate-fade-up delay-100"
          >
            Butuh alat?{" "}
            <span style={{ color: "var(--accent)" }}>Sewa saja,</span>
            <br />
            nggak harus beli.
          </h1>

          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--fg-muted)",
              lineHeight: 1.65,
              maxWidth: "44ch",
              marginBottom: "2rem",
            }}
            className="animate-fade-up delay-200"
          >
            Kamera, tripod, mikrofon, printer, proyektor — semua bisa disewa dari sesama mahasiswa. Lebih hemat, lebih praktis.
          </p>

          {/* Search bar */}
          <form
            action="/katalog"
            method="get"
            style={{ marginBottom: "1.5rem" }}
            className="animate-fade-up delay-300"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--r-btn)",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
                maxWidth: "480px",
              }}
            >
              <label htmlFor="hero-search" className="sr-only">
                Cari barang
              </label>
              <MagnifyingGlass
                size={18}
                style={{ margin: "0 0.75rem", color: "var(--fg-subtle)", flexShrink: 0 }}
              />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Cari kamera, tripod, proyektor..."
                autoComplete="off"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--fg)",
                  padding: "0.75rem 0",
                }}
              />
              <button
                type="submit"
                id="hero-search-btn"
                style={{
                  margin: "0.375rem",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "var(--r-btn)",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background var(--dur-fast)",
                }}
              >
                Cari
              </button>
            </div>
          </form>

          {/* Stats */}
          <div
            style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}
            className="animate-fade-up delay-400"
          >
            {[
              { n: "5+", label: "Kategori" },
              { n: "Gratis", label: "Daftar" },
              { n: "Bandung", label: "Area" },
            ].map(({ n, label }) => (
              <div key={label}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: visual grid */}
        <div
          style={{
            position: "relative",
            background: "var(--bg-muted)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "0.5rem",
            padding: "0.5rem",
          }}
          className="hero-visual"
        >
          {[
            {
              url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
              alt: "Kamera mirrorless untuk disewa mahasiswa",
              span: "1/2/2/3",
            },
            {
              url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
              alt: "Mikrofon podcast dan audio gear",
              span: "1/3/2/4",
            },
            {
              url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
              alt: "Proyektor presentasi",
              span: "2/2/3/4",
            },
          ].map(({ url, alt, span }) => (
            <div
              key={url}
              style={{
                gridArea: span,
                borderRadius: "var(--r-card)",
                overflow: "hidden",
                background: "#e2e8f0",
              }}
            >
              <img
                src={url}
                alt={alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
          {/* Accent overlay card */}
          <div
            style={{
              gridArea: "1/2/2/3",
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              background: "rgba(248,250,252,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: "var(--r-input)",
              padding: "0.75rem 1rem",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--fg-subtle)", marginBottom: "0.125rem" }}>Harga mulai</div>
            <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>
              Rp 35.000
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--fg-subtle)" }}>per hari</div>
          </div>
        </div>
      </section>

      {/* ── KATEGORI ────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "var(--fg)",
            marginBottom: "0.75rem",
          }}
        >
          Lima kategori, satu platform
        </h2>
        <p style={{ fontSize: "1rem", color: "var(--fg-muted)", marginBottom: "2.5rem", maxWidth: "48ch" }}>
          Dari alat fotografi hingga peralatan presentasi — semua tersedia untuk disewa.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/katalog?kategori=${cat.slug}`}
              id={`cat-${cat.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
                padding: "1.25rem",
                background: "var(--bg-card)",
                borderRadius: "var(--r-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                transition: "box-shadow var(--dur-med), transform var(--dur-med)",
                textDecoration: "none",
                color: "inherit",
              }}
              className="cat-card"
            >
              <span
                style={{
                  width: "44px",
                  height: "44px",
                  background: cat.bg,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <cat.icon size={22} color={cat.color} weight="duotone" />
              </span>
              <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--fg)" }}>{cat.label}</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--fg-muted)" }}>{cat.desc}</span>
              <span
                style={{
                  marginTop: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: cat.color,
                }}
              >
                Lihat semua <ArrowRight size={12} weight="bold" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BARANG PILIHAN ──────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "var(--bg-muted)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "var(--fg)",
                  marginBottom: "0.5rem",
                }}
              >
                Barang pilihan
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--fg-muted)" }}>
                Dipilih dari listing terbaik mahasiswa Bandung.
              </p>
            </div>
            <Link
              href="/katalog"
              id="lihat-semua-barang"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "var(--r-btn)",
                border: "1.5px solid var(--border)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--fg)",
                background: "var(--bg-card)",
                whiteSpace: "nowrap",
                transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
              }}
              className="btn-outline"
            >
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {featured.map((barang) => (
              <ProductCard key={barang.id} barang={barang} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ──────────────────────────────────── */}
      <section
        id="cara-kerja"
        style={{
          padding: "5rem 1.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "var(--fg)",
            marginBottom: "0.625rem",
          }}
        >
          Cara kerjanya sederhana
        </h2>
        <p style={{ fontSize: "1rem", color: "var(--fg-muted)", marginBottom: "3rem", maxWidth: "44ch" }}>
          Tiga langkah, dan kamu sudah bisa pakai barang yang kamu butuhkan.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {howItWorks.map((step, i) => (
            <div
              key={step.step}
              style={{
                padding: "1.75rem",
                background: "var(--bg-card)",
                borderRadius: "var(--r-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Big step number watermark */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-0.5rem",
                  right: "1rem",
                  fontSize: "5rem",
                  fontWeight: 900,
                  color: "var(--border)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                }}
              >
                {step.step}
              </span>

              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "var(--accent-light)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <step.icon size={22} color="var(--accent)" weight="duotone" />
              </div>
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "var(--fg)",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--fg-muted)", lineHeight: 1.65 }}>
                {step.desc}
              </p>

              {i < howItWorks.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "-0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    display: "none",
                  }}
                  className="step-arrow"
                >
                  <ArrowRight size={20} color="var(--fg-subtle)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── AJAKAN SEWAKAN ──────────────────────────────── */}
      <section
        id="sewakan"
        style={{
          padding: "5rem 1.5rem",
          background: "var(--fg)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="sewakan-grid"
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "rgba(5,150,105,0.15)",
                color: "#34d399",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.375rem 0.75rem",
                borderRadius: "999px",
                marginBottom: "1.5rem",
              }}
            >
              <Storefront size={14} weight="bold" />
              Punya barang nganggur?
            </div>

            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
              }}
            >
              Sewakan, hasilkan
              <br />
              <span style={{ color: "#34d399" }}>penghasilan tambahan.</span>
            </h2>

            <p style={{ fontSize: "1rem", color: "#94a3b8", lineHeight: 1.65, maxWidth: "42ch", marginBottom: "2rem" }}>
              Barang yang jarang dipakai bisa menghasilkan uang. Daftarkan listing kamu dan mulai terima penyewa dari mahasiswa sekampus.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { icon: ShieldCheck, text: "Penyewa terverifikasi sesama mahasiswa" },
                { icon: HandCoins, text: "Kamu yang menentukan harga dan syarat sewa" },
                { icon: ChatCircle, text: "Koordinasi langsung, tidak ada biaya platform" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#cbd5e1" }}>
                  <Icon size={18} color="#34d399" weight="bold" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.9375rem" }}>{text}</span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: "0.8125rem",
                color: "#475569",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "8px",
                borderLeft: "3px solid #34d399",
                marginBottom: "1.75rem",
              }}
            >
              Formulir pendaftaran pemilik akan tersedia segera. Tahap 2 akan membuka fitur ini secara penuh.
            </p>

            <Link
              href="/sewakan-barang"
              id="daftar-pemilik-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                borderRadius: "var(--r-btn)",
                background: "#059669",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1rem",
                transition: "background var(--dur-fast)",
              }}
              className="cta-green"
            >
              Mulai Sewakan Barang
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          {/* Right: visual */}
          <div
            style={{
              borderRadius: "var(--r-card)",
              overflow: "hidden",
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            className="sewakan-visual"
          >
            <img
              src="https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80"
              alt="Peralatan kamera dan perlengkapan untuk disewakan"
              style={{ width: "100%", height: "320px", objectFit: "cover", opacity: 0.9 }}
            />
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {[
                  { n: "Rp 0", label: "Biaya platform" },
                  { n: "Kamu", label: "Yang atur harga" },
                  { n: "Mudah", label: "Proses daftar" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#34d399", letterSpacing: "-0.02em" }}>{n}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
