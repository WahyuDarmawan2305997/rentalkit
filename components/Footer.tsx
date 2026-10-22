import Link from "next/link";
import { Package, InstagramLogo, TwitterLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--fg)",
        color: "#94a3b8",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span
              style={{
                width: "30px",
                height: "30px",
                background: "var(--accent)",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package size={16} color="white" weight="bold" />
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "#f8fafc",
                letterSpacing: "-0.02em",
              }}
            >
              Rental<span style={{ color: "var(--accent)" }}>Kit</span>
            </span>
          </div>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "220px" }}>
            Platform sewa-menyewa peralatan antar mahasiswa di Bandung. Hemat, mudah, terpercaya.
          </p>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.75rem",
              color: "#475569",
              padding: "0.5rem 0.75rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
              lineHeight: 1.5,
            }}
          >
            Harga, lokasi, dan pemilik merupakan data demonstrasi. Belum ada transaksi nyata.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "1rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Navigasi
          </p>
          {[
            { href: "/", label: "Beranda" },
            { href: "/katalog", label: "Katalog Barang" },
            { href: "/#cara-kerja", label: "Cara Kerja" },
            { href: "/#sewakan", label: "Sewakan Barang" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: "block",
                fontSize: "0.875rem",
                padding: "0.25rem 0",
                color: "#94a3b8",
                transition: "color 150ms",
              }}
              className="footer-link"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Kategori */}
        <div>
          <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "1rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Kategori
          </p>
          {["Kamera", "Tripod", "Mikrofon", "Printer", "Proyektor"].map((cat) => (
            <Link
              key={cat}
              href={`/katalog?kategori=${cat.toLowerCase()}`}
              style={{
                display: "block",
                fontSize: "0.875rem",
                padding: "0.25rem 0",
                color: "#94a3b8",
                transition: "color 150ms",
              }}
              className="footer-link"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Kontak */}
        <div>
          <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "1rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Kontak
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <a
              href="mailto:halo@rentalkit.id"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#94a3b8" }}
              className="footer-link"
            >
              <EnvelopeSimple size={16} />
              halo@rentalkit.id
            </a>
            <a
              href="#"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#94a3b8" }}
              className="footer-link"
            >
              <InstagramLogo size={16} />
              @rentalkit.id
            </a>
            <a
              href="#"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#94a3b8" }}
              className="footer-link"
            >
              <TwitterLogo size={16} />
              @rentalkitid
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1.25rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          fontSize: "0.8125rem",
          color: "#475569",
        }}
      >
        <span>© 2025 RentalKit. Platform demonstrasi mahasiswa.</span>
        <span>Dibuat dengan semangat mahasiswa Bandung</span>
      </div>
    </footer>
  );
}
