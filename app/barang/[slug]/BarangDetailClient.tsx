"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import {
  MapPin,
  Star,
  Calendar,
  ArrowLeft,
  CheckCircle,
  X,
  Info,
  WarningCircle,
  ChartLineUp,
  Phone,
} from "@phosphor-icons/react";
import type { Barang } from "@/lib/data";
import { formatRupiah, categoryLabels, getCategoryFallbackImage } from "@/lib/data";

const conditionColors: Record<string, { bg: string; text: string; border: string }> = {
  "Baru":        { bg: "#d1fae5", text: "#059669", border: "#a7f3d0" },
  "Sangat Baik": { bg: "#e0f2fe", text: "#0284c7", border: "#bae6fd" },
  "Baik":        { bg: "#fef3c7", text: "#d97706", border: "#fde68a" },
  "Cukup":       { bg: "#fee2e2", text: "#dc2626", border: "#fecaca" },
};

interface Props {
  barang: Barang;
}

export default function BarangDetailClient({ barang }: Props) {
  // todayStr computed client-side only to avoid prerender date instability
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

  const [activeImg,   setActiveImg]   = useState(0);
  const [startDate,   setStartDate]   = useState("");
  const [endDate,     setEndDate]     = useState("");
  const [showModal,   setShowModal]   = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [dateError,   setDateError]   = useState("");

  const cc = conditionColors[barang.condition] ?? conditionColors["Baik"];

  /* ── Rental calculation ─────────────────────── */
  function getDays(): number {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  }
  const days  = getDays();
  const total = days * barang.pricePerDay;

  function validateDates(): boolean {
    setDateError("");
    if (!startDate) { setDateError("Tanggal mulai wajib diisi."); return false; }
    if (!endDate)   { setDateError("Tanggal selesai wajib diisi."); return false; }
    const s = new Date(startDate);
    const e = new Date(endDate);
    const t = new Date(todayStr);
    if (s < t) { setDateError("Tanggal mulai tidak boleh sebelum hari ini."); return false; }
    if (e <= s) { setDateError("Tanggal selesai harus setelah tanggal mulai."); return false; }
    return true;
  }

  function handleAjukan() {
    if (!validateDates()) return;
    setShowModal(true);
    setSubmitted(false);
  }

  function handleConfirm() {
    setSubmitted(true);
  }

  function handleClose() {
    setShowModal(false);
    if (submitted) {
      setStartDate("");
      setEndDate("");
    }
  }

  return (
    <>
      {/* ── Breadcrumb ─────────────────────────── */}
      <div style={{ padding: "1.25rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--fg-muted)" }}>
          <Link href="/" style={{ color: "var(--fg-subtle)" }}>Beranda</Link>
          <span>/</span>
          <Link href="/katalog" style={{ color: "var(--fg-subtle)" }}>Katalog</Link>
          <span>/</span>
          <Link href={`/katalog?kategori=${barang.category}`} style={{ color: "var(--fg-subtle)" }}>
            {categoryLabels[barang.category]}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>{barang.name}</span>
        </div>
      </div>

      {/* ── Main layout ────────────────────────── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem 5rem",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "3rem",
          alignItems: "start",
        }}
        className="detail-grid"
      >
        {/* LEFT: Images + Info */}
        <div>
          {/* Image gallery */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                borderRadius: "var(--r-card)",
                overflow: "hidden",
                background: "var(--bg-muted)",
                aspectRatio: "16/10",
                marginBottom: "0.75rem",
              }}
            >
              <img
                src={barang.images[activeImg]}
                alt={`${barang.name} — foto ${activeImg + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCategoryFallbackImage(
                    barang.category,
                    barang.name
                  );
                }}
              />
            </div>
            {barang.images.length > 1 && (
              <div style={{ display: "flex", gap: "0.625rem" }}>
                {barang.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Foto ${i + 1}`}
                    aria-pressed={activeImg === i}
                    style={{
                      width: "72px",
                      height: "54px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: `2px solid ${activeImg === i ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                      padding: 0,
                      background: "none",
                      flexShrink: 0,
                      transition: "border-color var(--dur-fast)",
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCategoryFallbackImage(
                          barang.category,
                          barang.name
                        );
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + badges */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "var(--bg-muted)",
                  color: "var(--fg-muted)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "0.25rem 0.625rem",
                  borderRadius: "999px",
                  border: "1px solid var(--border)",
                }}
              >
                {categoryLabels[barang.category]}
              </span>
              <span
                style={{
                  background: cc.bg,
                  color: cc.text,
                  border: `1px solid ${cc.border}`,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "0.25rem 0.625rem",
                  borderRadius: "999px",
                }}
              >
                Kondisi: {barang.condition}
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "var(--fg)",
                lineHeight: 1.15,
                marginBottom: "0.625rem",
              }}
            >
              {barang.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--fg-muted)", fontSize: "0.9rem" }}>
              <MapPin size={15} weight="fill" />
              <span>{barang.location}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.625rem" }}>
              Deskripsi
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--fg-muted)", lineHeight: 1.75 }}>
              {barang.description}
            </p>
          </div>

          {/* Specs */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.875rem" }}>
              Spesifikasi
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "0.625rem",
              }}
            >
              {barang.specs.map((spec) => (
                <div
                  key={spec.label}
                  style={{
                    background: "var(--bg-muted)",
                    borderRadius: "var(--r-input)",
                    padding: "0.75rem 1rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--fg-subtle)", marginBottom: "0.25rem", fontWeight: 500 }}>
                    {spec.label}
                  </div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--fg)" }}>
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.875rem" }}>
              Ketentuan Sewa
            </h2>
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "var(--r-input)",
                padding: "1rem 1.25rem",
              }}
            >
              {barang.terms.map((term, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.625rem",
                    paddingBottom: i < barang.terms.length - 1 ? "0.625rem" : 0,
                    marginBottom: i < barang.terms.length - 1 ? "0.625rem" : 0,
                    borderBottom: i < barang.terms.length - 1 ? "1px solid #fde68a" : "none",
                  }}
                >
                  <Info size={15} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "0.9rem", color: "#92400e", lineHeight: 1.55 }}>{term}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner profile */}
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.875rem" }}>
              Informasi Pemilik
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem",
                background: "var(--bg-card)",
                borderRadius: "var(--r-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <img
                src={barang.owner.avatar}
                alt={barang.owner.name}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  objectFit: "cover",
                  border: "2px solid var(--accent-light)",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://picsum.photos/seed/${barang.owner.name}/80/80`;
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--fg)", marginBottom: "0.25rem" }}>
                  {barang.owner.name}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--fg-muted)", marginBottom: "0.375rem" }}>
                  {barang.owner.campus}
                </div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8125rem" }}>
                    <Star size={13} weight="fill" style={{ color: "#f59e0b" }} />
                    <span style={{ fontWeight: 600, color: "var(--fg)" }}>{barang.owner.rating}</span>
                    <span style={{ color: "var(--fg-subtle)" }}>rating</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8125rem" }}>
                    <ChartLineUp size={13} color="var(--accent)" />
                    <span style={{ fontWeight: 600, color: "var(--fg)" }}>{barang.owner.totalSewa}</span>
                    <span style={{ color: "var(--fg-subtle)" }}>sewa selesai</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
                <Phone size={14} style={{ display: "inline", marginRight: "0.25rem" }} />
                {barang.owner.phone}
              </div>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--fg-subtle)", marginTop: "0.625rem" }}>
              Data pemilik adalah demonstrasi. Nomor telepon bukan nomor nyata.
            </p>
          </div>
        </div>

        {/* RIGHT: Rental sidebar ─────────────────── */}
        <aside
          style={{
            position: "sticky",
            top: "80px",
            background: "var(--bg-card)",
            borderRadius: "var(--r-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
          }}
        >
          {/* Price header */}
          <div
            style={{
              padding: "1.25rem 1.25rem 1rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--accent-light)",
            }}
          >
            <div style={{ fontSize: "0.8125rem", color: "var(--accent-dark)", marginBottom: "0.25rem" }}>
              Harga sewa
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.03em" }}>
                {formatRupiah(barang.pricePerDay)}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--accent-dark)", fontWeight: 500 }}>/hari</span>
            </div>
          </div>

          <div style={{ padding: "1.25rem" }}>
            {/* Date inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1rem" }}>
              <div>
                <label
                  htmlFor="start-date"
                  style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg)", display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}
                >
                  <Calendar size={14} />
                  Tanggal Mulai
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min={todayStr}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDateError("");
                    if (endDate && e.target.value >= endDate) setEndDate("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--r-input)",
                    border: "1.5px solid var(--border)",
                    fontSize: "0.9rem",
                    color: "var(--fg)",
                    background: "var(--bg-card)",
                    outline: "none",
                    transition: "border-color var(--dur-fast)",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="end-date"
                  style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg)", display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}
                >
                  <Calendar size={14} />
                  Tanggal Selesai
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate || todayStr}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDateError("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--r-input)",
                    border: "1.5px solid var(--border)",
                    fontSize: "0.9rem",
                    color: "var(--fg)",
                    background: "var(--bg-card)",
                    outline: "none",
                    transition: "border-color var(--dur-fast)",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            {/* Validation error */}
            {dateError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.375rem",
                  padding: "0.625rem 0.875rem",
                  background: "#fee2e2",
                  borderRadius: "var(--r-input)",
                  marginBottom: "0.875rem",
                  border: "1px solid #fecaca",
                }}
              >
                <WarningCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: "1px" }} />
                <span style={{ fontSize: "0.8125rem", color: "#b91c1c", lineHeight: 1.5 }}>{dateError}</span>
              </div>
            )}

            {/* Cost breakdown */}
            {days > 0 && (
              <div
                style={{
                  background: "var(--bg-muted)",
                  borderRadius: "var(--r-input)",
                  padding: "0.875rem 1rem",
                  marginBottom: "1rem",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--fg-muted)", marginBottom: "0.5rem" }}>
                  <span>{formatRupiah(barang.pricePerDay)} &times; {days} hari</span>
                  <span style={{ fontWeight: 500 }}>{formatRupiah(barang.pricePerDay * days)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "var(--fg)",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <span>Total (estimasi)</span>
                  <span style={{ color: "var(--accent)" }}>{formatRupiah(total)}</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              id="ajukan-sewa-btn"
              onClick={handleAjukan}
              disabled={!barang.available}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "var(--r-btn)",
                background: barang.available ? "var(--accent)" : "var(--bg-muted)",
                color: barang.available ? "var(--accent-fg)" : "var(--fg-subtle)",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                cursor: barang.available ? "pointer" : "not-allowed",
                transition: "background var(--dur-fast)",
                marginBottom: "0.75rem",
              }}
              className={barang.available ? "btn-accent" : ""}
            >
              {barang.available ? "Ajukan Sewa" : "Sedang Tidak Tersedia"}
            </button>

            <p style={{ fontSize: "0.75rem", color: "var(--fg-subtle)", textAlign: "center", lineHeight: 1.5 }}>
              Ini adalah simulasi. Tidak ada transaksi nyata yang terjadi.
            </p>
          </div>

          {/* Demo disclaimer */}
          <div
            style={{
              padding: "0.875rem 1.25rem",
              background: "var(--bg-muted)",
              borderTop: "1px solid var(--border)",
              fontSize: "0.75rem",
              color: "var(--fg-subtle)",
              lineHeight: 1.6,
            }}
          >
            Harga, pemilik, dan ketersediaan adalah data demonstrasi. RentalKit belum memproses pembayaran nyata.
          </div>
        </aside>
      </div>

      {/* ── Confirmation Modal ─────────────────── */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={handleClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal panel */}
          <div
            style={{
              position: "relative",
              background: "var(--bg-card)",
              borderRadius: "var(--r-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.25)",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
              animation: "fadeUp 0.3s var(--ease-out) both",
            }}
          >
            <button
              onClick={handleClose}
              aria-label="Tutup modal"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "var(--bg-muted)",
                border: "none",
                borderRadius: "999px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--fg-muted)",
              }}
            >
              <X size={16} />
            </button>

            {!submitted ? (
              <>
                <div style={{ padding: "1.75rem 1.75rem 1.25rem" }}>
                  <h2
                    id="modal-title"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--fg)",
                      letterSpacing: "-0.02em",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Konfirmasi Pengajuan Sewa
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                    Periksa kembali detail sewa sebelum melanjutkan.
                  </p>
                </div>

                <div style={{ padding: "0 1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {/* Barang info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.875rem",
                      padding: "1rem",
                      background: "var(--bg-muted)",
                      borderRadius: "var(--r-input)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <img
                      src={barang.images[0]}
                      alt={barang.name}
                      style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--fg)" }}>{barang.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--fg-muted)", marginTop: "0.125rem" }}>{barang.location}</div>
                    </div>
                  </div>

                  {/* Detail rows */}
                  {[
                    { label: "Pemilik",        value: barang.owner.name },
                    { label: "Tanggal Mulai",  value: new Date(startDate).toLocaleDateString("id-ID", { dateStyle: "long" }) },
                    { label: "Tanggal Selesai",value: new Date(endDate).toLocaleDateString("id-ID", { dateStyle: "long" }) },
                    { label: "Durasi",         value: `${days} hari` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.625rem" }}>
                      <span style={{ color: "var(--fg-muted)" }}>{label}</span>
                      <span style={{ fontWeight: 600, color: "var(--fg)" }}>{value}</span>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "var(--fg)",
                    }}
                  >
                    <span>Total Estimasi</span>
                    <span style={{ color: "var(--accent)" }}>{formatRupiah(total)}</span>
                  </div>

                  {/* Disclaimer */}
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      background: "#fffbeb",
                      borderRadius: "var(--r-input)",
                      border: "1px solid #fde68a",
                      fontSize: "0.8125rem",
                      color: "#92400e",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Perhatian:</strong> Ini adalah simulasi demo. Tidak ada transaksi nyata, pembayaran, atau komunikasi yang terjadi. Koordinasikan langsung dengan pemilik.
                  </div>
                </div>

                <div style={{ padding: "0 1.75rem 1.75rem", display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      borderRadius: "var(--r-btn)",
                      border: "1.5px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--fg-muted)",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                    }}
                  >
                    Batalkan
                  </button>
                  <button
                    id="konfirmasi-sewa-btn"
                    onClick={handleConfirm}
                    style={{
                      flex: 2,
                      padding: "0.75rem",
                      borderRadius: "var(--r-btn)",
                      background: "var(--accent)",
                      color: "var(--accent-fg)",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      border: "none",
                      cursor: "pointer",
                      transition: "background var(--dur-fast)",
                    }}
                    className="btn-accent"
                  >
                    Ya, Ajukan Sewa
                  </button>
                </div>
              </>
            ) : (
              /* Success state */
              <div
                style={{
                  padding: "2.5rem 2rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.875rem",
                }}
              >
                <CheckCircle size={56} color="var(--accent)" weight="duotone" />
                <h2 id="modal-title" style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--fg)", letterSpacing: "-0.02em" }}>
                  Pengajuan Berhasil!
                </h2>
                <p style={{ fontSize: "0.9375rem", color: "var(--fg-muted)", maxWidth: "32ch", lineHeight: 1.65 }}>
                  Simulasi pengajuan sewa <strong>{barang.name}</strong> selama <strong>{days} hari</strong> ({formatRupiah(total)}) berhasil dicatat.
                </p>
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    background: "#fffbeb",
                    borderRadius: "var(--r-input)",
                    border: "1px solid #fde68a",
                    fontSize: "0.8125rem",
                    color: "#92400e",
                    width: "100%",
                    textAlign: "left",
                    lineHeight: 1.6,
                  }}
                >
                  Ini hanya simulasi demo. Tidak ada transaksi nyata. Hubungi pemilik langsung untuk menyewa sungguhan.
                </div>
                <button
                  id="tutup-modal-btn"
                  onClick={handleClose}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem 2rem",
                    borderRadius: "var(--r-btn)",
                    background: "var(--accent)",
                    color: "var(--accent-fg)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .btn-accent:hover { background: var(--accent-dark) !important; }
        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
            top: 0 !important;
          }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          border: 0;
        }
      `}</style>
    </>
  );
}
