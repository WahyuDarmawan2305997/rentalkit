"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  Package,
  Camera,
  Bank,
  QrCode,
  Wallet,
  CheckCircle,
  WarningCircle,
  UploadSimple,
  Trash,
  ArrowRight,
  ShieldCheck,
  Sparkle,
  CalendarCheck,
  ArrowLeft,
  X,
  Info,
} from "@phosphor-icons/react";
import {
  PAKET_SEWA,
  type PaketSewa,
  type Category,
  categoryLabels,
  formatRupiah,
  LOKASI_UPI,
} from "@/lib/data";

interface FormData {
  nama: string;
  kategori: Category | "";
  hargaPerHari: string;
  kondisi: "Baru" | "Sangat Baik" | "Baik" | "Cukup" | "";
  lokasi: string;
  deskripsi: string;
}

type PaymentMethodId = "bank" | "qris" | "ewallet";

interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  sublabel: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bank",
    label: "Transfer Bank (Demo)",
    sublabel: "BCA / Mandiri / BNI Virtual Account",
  },
  {
    id: "qris",
    label: "QRIS (Demo)",
    sublabel: "Scan instan via semua aplikasi e-wallet",
  },
  {
    id: "ewallet",
    label: "E-Wallet (Demo)",
    sublabel: "GoPay / OVO / DANA / ShopeePay",
  },
];

export default function SewakanBarangClient() {
  const formId = useId();

  // ── Bagian A: State Formulir Barang ─────────────────────
  const [form, setForm] = useState<FormData>({
    nama: "",
    kategori: "",
    hargaPerHari: "",
    kondisi: "",
    lokasi: "",
    deskripsi: "",
  });

  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFileName, setFotoFileName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Bagian B: State Pilihan Paket ───────────────────────
  const [selectedPaketId, setSelectedPaketId] = useState<string>("6bulan");

  // ── Bagian C: State Metode Pembayaran ───────────────────
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId>("qris");

  // ── Bagian D: State Alur Simulasi Transaksi ──────────────
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isProcessingDemoPay, setIsProcessingDemoPay] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);
  const [paidAtDate, setPaidAtDate] = useState<Date | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Paket terpilih dari sumber data terpusat PAKET_SEWA
  const selectedPaket: PaketSewa | undefined = PAKET_SEWA.find(
    (p) => p.id === selectedPaketId
  );

  // Handler input formulir (tidak mereset saat pilih paket/metode)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat user mengetik
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Handler upload foto barang dengan preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          foto: "Ukuran foto maksimal 5 MB.",
        }));
        return;
      }
      setFotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.foto;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFotoPreview(null);
    setFotoFileName("");
  };

  // Validasi formulir barang
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.nama.trim()) {
      newErrors.nama = "Nama barang wajib diisi.";
    } else if (form.nama.trim().length < 3) {
      newErrors.nama = "Nama barang minimal 3 karakter.";
    }

    if (!form.kategori) {
      newErrors.kategori = "Silakan pilih kategori barang.";
    }

    const hargaNum = parseInt(form.hargaPerHari, 10);
    if (!form.hargaPerHari) {
      newErrors.hargaPerHari = "Harga sewa per hari wajib diisi.";
    } else if (isNaN(hargaNum) || hargaNum < 5000) {
      newErrors.hargaPerHari = "Harga minimal Rp 5.000 per hari.";
    }

    if (!form.kondisi) {
      newErrors.kondisi = "Silakan pilih kondisi barang.";
    }

    if (!form.lokasi) {
      newErrors.lokasi = "Silakan pilih lokasi di sekitar UPI.";
    }

    if (!form.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi barang wajib diisi.";
    } else if (form.deskripsi.trim().length < 15) {
      newErrors.deskripsi = "Deskripsi minimal 15 karakter agar penyewa paham kondisinya.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hitung tanggal kedaluwarsa paket berdasarkan durasi
  const calculateExpiryDate = (startDate: Date, durasiBulan: number): string => {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + durasiBulan);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  // Langkah 4: Pengguna menekan tombol "Sewakan Barang"
  const handlePicuPembayaran = () => {
    const isFormValid = validateForm();
    if (!isFormValid) {
      // Scroll perlahan ke atas jika formulir belum valid
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    if (!selectedPaket) {
      setErrors((prev) => ({ ...prev, paket: "Pilih salah satu paket listing." }));
      return;
    }

    if (!selectedPayment) {
      setErrors((prev) => ({ ...prev, pembayaran: "Pilih salah satu metode pembayaran." }));
      return;
    }

    // Buka modal konfirmasi simulasi
    setShowConfirmModal(true);
  };

  // Langkah 5 & 6: Konfirmasi simulasi pembayaran berhasil
  const handleConfirmSimulation = () => {
    setIsProcessingDemoPay(true);
    // Simulasi respons cepat 600ms
    setTimeout(() => {
      setIsProcessingDemoPay(false);
      setShowConfirmModal(false);
      setPaymentDone(true);
      setPaidAtDate(new Date());
    }, 600);
  };

  // Langkah 7 & 8: Pengguna menekan tombol akhir "Submit Barang"
  const handleSubmitBarang = () => {
    if (!validateForm() || !selectedPaket || !paymentDone) {
      return;
    }
    setShowSuccessModal(true);
  };

  const hargaNum = parseInt(form.hargaPerHari, 10);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "6rem" }}>
      {/* ── Breadcrumb & Header ─────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
          padding: "2rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: "var(--fg-muted)",
              marginBottom: "1rem",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                color: "var(--fg-subtle)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} /> Beranda
            </Link>
            <span>/</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>Sewakan Barang</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "999px",
                  marginBottom: "0.5rem",
                }}
              >
                <Sparkle size={13} weight="bold" /> Satu Halaman Pendaftaran
              </span>
              <h1
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.375rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--fg)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Sewakan Barang Kamu
              </h1>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--fg-muted)",
                  marginTop: "0.5rem",
                  marginBottom: 0,
                  maxWidth: "60ch",
                  lineHeight: 1.5,
                }}
              >
                Daftarkan peralatan kuliahmu, pilih paket aktif tanpa potongan komisi,
                dan mulai hasilkan uang sewa dari sesama mahasiswa Bandung.
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1rem",
                borderRadius: "var(--r-card)",
                background: "rgba(5, 150, 105, 0.08)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
                fontSize: "0.8125rem",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={18} weight="fill" />
              100% Penghasilan Sewa Milikmu
            </div>
          </div>
        </div>
      </section>

      {/* ── Kontainer Utama (Form, Paket, Pembayaran, Submit) ──────── */}
      <main style={{ maxWidth: "860px", margin: "2rem auto 0", padding: "0 1.5rem" }}>
        
        {/* ========================================================== */}
        {/* BAGIAN A: FORMULIR BARANG                                  */}
        {/* ========================================================== */}
        <section
          aria-labelledby="section-barang-title"
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--r-card)",
            border: "1.5px solid var(--border)",
            padding: "2rem",
            boxShadow: "var(--shadow-card)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--accent)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              A
            </span>
            <div>
              <h2
                id="section-barang-title"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--fg)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Informasi Barang
              </h2>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
                Isi detail peralatan yang ingin kamu sewakan kepada mahasiswa lain.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
            {/* Field: Nama Barang */}
            <div>
              <label
                htmlFor={`${formId}-nama`}
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: "0.375rem",
                }}
              >
                Nama Barang <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id={`${formId}-nama`}
                name="nama"
                type="text"
                placeholder="Contoh: Sony Alpha A6400 + Lensa Kit 16-50mm"
                value={form.nama}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--r-input)",
                  border: `1.5px solid ${errors.nama ? "#dc2626" : "var(--border)"}`,
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "0.9375rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.nama && (
                <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                  {errors.nama}
                </p>
              )}
            </div>

            {/* Grid 2 kolom: Kategori & Harga Sewa */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {/* Field: Kategori */}
              <div>
                <label
                  htmlFor={`${formId}-kategori`}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Kategori Barang <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id={`${formId}-kategori`}
                  name="kategori"
                  value={form.kategori}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--r-input)",
                    border: `1.5px solid ${errors.kategori ? "#dc2626" : "var(--border)"}`,
                    background: "var(--bg)",
                    color: form.kategori ? "var(--fg)" : "var(--fg-subtle)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="" disabled>
                    -- Pilih Kategori --
                  </option>
                  <option value="kamera">Kamera (Mirrorless, DSLR, Action Cam)</option>
                  <option value="tripod">Tripod (Fleksibel, Full-size, Mini)</option>
                  <option value="mikrofon">Mikrofon (Shotgun, Lavalier, Wireless)</option>
                  <option value="printer">Printer (Inkjet, All-in-One, Scanner)</option>
                  <option value="proyektor">Proyektor (Portable, Mini, HDMI)</option>
                </select>
                {errors.kategori && (
                  <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                    {errors.kategori}
                  </p>
                )}
              </div>

              {/* Field: Harga Sewa per Hari */}
              <div>
                <label
                  htmlFor={`${formId}-harga`}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Harga Sewa per Hari (Rp) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--fg-subtle)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    Rp
                  </span>
                  <input
                    id={`${formId}-harga`}
                    name="hargaPerHari"
                    type="number"
                    min="5000"
                    step="5000"
                    placeholder="Contoh: 75000"
                    value={form.hargaPerHari}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.75rem",
                      borderRadius: "var(--r-input)",
                      border: `1.5px solid ${errors.hargaPerHari ? "#dc2626" : "var(--border)"}`,
                      background: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: "0.9375rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                {!isNaN(hargaNum) && hargaNum > 0 && (
                  <p style={{ margin: "0.25rem 0 0", color: "var(--accent)", fontSize: "0.75rem", fontWeight: 600 }}>
                    {formatRupiah(hargaNum)} / hari
                  </p>
                )}
                {errors.hargaPerHari && (
                  <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                    {errors.hargaPerHari}
                  </p>
                )}
              </div>
            </div>

            {/* Grid 2 kolom: Kondisi & Lokasi */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {/* Field: Kondisi Barang */}
              <div>
                <label
                  htmlFor={`${formId}-kondisi`}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Kondisi Barang <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id={`${formId}-kondisi`}
                  name="kondisi"
                  value={form.kondisi}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--r-input)",
                    border: `1.5px solid ${errors.kondisi ? "#dc2626" : "var(--border)"}`,
                    background: "var(--bg)",
                    color: form.kondisi ? "var(--fg)" : "var(--fg-subtle)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="" disabled>
                    -- Pilih Kondisi --
                  </option>
                  <option value="Baru">Baru (Mulus tanpa lecet)</option>
                  <option value="Sangat Baik">Sangat Baik (Fungsi 100%, baret halus pemakaian)</option>
                  <option value="Baik">Baik (Fungsi normal terawat)</option>
                  <option value="Cukup">Cukup (Fungsi normal, tanda pemakaian jelas)</option>
                </select>
                {errors.kondisi && (
                  <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                    {errors.kondisi}
                  </p>
                )}
              </div>

              {/* Field: Lokasi */}
              <div>
                <label
                  htmlFor={`${formId}-lokasi`}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Lokasi (Area Sekitar UPI) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id={`${formId}-lokasi`}
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--r-input)",
                    border: `1.5px solid ${errors.lokasi ? "#dc2626" : "var(--border)"}`,
                    background: "var(--bg)",
                    color: form.lokasi ? "var(--fg)" : "var(--fg-subtle)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="" disabled>
                    -- Pilih Lokasi --
                  </option>
                  {LOKASI_UPI.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}, Bandung
                    </option>
                  ))}
                </select>
                {errors.lokasi && (
                  <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                    {errors.lokasi}
                  </p>
                )}
              </div>
            </div>

            {/* Field: Deskripsi */}
            <div>
              <label
                htmlFor={`${formId}-deskripsi`}
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: "0.375rem",
                }}
              >
                Deskripsi Barang <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                id={`${formId}-deskripsi`}
                name="deskripsi"
                rows={3}
                placeholder="Jelaskan kelengkapan (kabel, baterai, tas), syarat peminjaman, atau aturan khusus..."
                value={form.deskripsi}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--r-input)",
                  border: `1.5px solid ${errors.deskripsi ? "#dc2626" : "var(--border)"}`,
                  background: "var(--bg)",
                  color: "var(--fg)",
                  fontSize: "0.9375rem",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
              {errors.deskripsi && (
                <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                  {errors.deskripsi}
                </p>
              )}
            </div>

            {/* Field: Foto Barang dengan Preview */}
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: "0.375rem",
                }}
              >
                Foto Barang (dengan Preview)
              </span>

              {fotoPreview ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1rem",
                    background: "var(--bg-muted)",
                    borderRadius: "var(--r-input)",
                    border: "1.5px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: "90px",
                      height: "70px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                      background: "#0f172a",
                    }}
                  >
                    <img
                      src={fotoPreview}
                      alt="Preview Foto Barang"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--fg)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {fotoFileName || "Foto berhasil diunggah"}
                    </p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--accent)" }}>
                      ✓ Siap ditampilkan di katalog
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--r-btn)",
                      border: "1px solid #fecaca",
                      background: "#fff1f2",
                      color: "#e11d48",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Trash size={14} /> Hapus
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={`${formId}-foto`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1.75rem 1rem",
                    borderRadius: "var(--r-input)",
                    border: "2px dashed var(--border)",
                    background: "var(--bg)",
                    cursor: "pointer",
                    transition: "border-color var(--dur-fast)",
                    textAlign: "center",
                  }}
                >
                  <UploadSimple size={28} color="var(--accent)" />
                  <div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent)" }}>
                      Klik untuk unggah foto
                    </span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
                      {" "}atau seret foto ke sini
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--fg-subtle)" }}>
                    JPG, PNG, atau WEBP (Maksimal 5 MB)
                  </span>
                  <input
                    id={`${formId}-foto`}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
              {errors.foto && (
                <p style={{ margin: "0.25rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
                  {errors.foto}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* BAGIAN B: PILIHAN PAKET DI BAWAH FORMULIR                   */}
        {/* ========================================================== */}
        <section
          aria-labelledby="section-paket-title"
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--r-card)",
            border: "1.5px solid var(--border)",
            padding: "2rem",
            boxShadow: "var(--shadow-card)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--accent)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              B
            </span>
            <div>
              <h2
                id="section-paket-title"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--fg)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Pilihan Paket Berlangganan Listing
              </h2>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
                RentalKit memperoleh pendapatan dari paket berlangganan, bukan potongan komisi transaksi.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "0.625rem 0.875rem",
              borderRadius: "8px",
              background: "rgba(15, 23, 42, 0.04)",
              borderLeft: "3px solid var(--accent)",
              fontSize: "0.8125rem",
              color: "var(--fg-muted)",
              marginBottom: "1.5rem",
              marginTop: "0.75rem",
            }}
          >
            💡 <strong>100% uang sewa adalah milikmu:</strong> Kamu bebas menentukan harga dan menerima pembayaran sewa secara langsung tanpa potongan sepeser pun.
          </div>

          {/* 3 Kartu Paket Berlangganan */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "1rem",
            }}
          >
            {PAKET_SEWA.map((paket) => {
              const isSelected = selectedPaketId === paket.id;
              return (
                <div
                  key={paket.id}
                  onClick={() => setSelectedPaketId(paket.id)}
                  style={{
                    position: "relative",
                    borderRadius: "var(--r-card)",
                    border: isSelected
                      ? "2px solid var(--accent)"
                      : "1.5px solid var(--border)",
                    background: isSelected
                      ? "rgba(5, 150, 105, 0.04)"
                      : "var(--bg)",
                    padding: "1.5rem 1.25rem",
                    cursor: "pointer",
                    transition: "all var(--dur-fast)",
                    boxShadow: isSelected
                      ? "0 0 0 2px rgba(5,150,105,0.15), var(--shadow-card)"
                      : "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Badge Penanda Visual Paling Hemat / Hemat */}
                  {paket.hematLabel && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "12px",
                        background: paket.isPalingHemat
                          ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                          : "#0284c7",
                        color: "#ffffff",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        padding: "0.2rem 0.625rem",
                        borderRadius: "999px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                      }}
                    >
                      {paket.isPalingHemat && "🔥 "}
                      {paket.hematLabel}
                    </span>
                  )}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg)" }}>
                        {paket.nama}
                      </span>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isSelected ? "var(--accent)" : "transparent",
                        }}
                      >
                        {isSelected && (
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffffff" }} />
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: "0.75rem" }}>
                      <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.02em" }}>
                        {formatRupiah(paket.harga)}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--fg-subtle)" }}>
                        untuk durasi <strong>{paket.durasiLabel}</strong>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.8125rem", color: "var(--fg-muted)", lineHeight: 1.4, margin: 0 }}>
                      {paket.deskripsi}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px dashed var(--border)",
                      fontSize: "0.75rem",
                      color: isSelected ? "var(--accent)" : "var(--fg-subtle)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle size={14} weight="fill" /> Paket Terpilih
                      </>
                    ) : (
                      "Klik untuk memilih"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {errors.paket && (
            <p style={{ margin: "0.5rem 0 0", color: "#dc2626", fontSize: "0.75rem" }}>
              {errors.paket}
            </p>
          )}
        </section>

        {/* ========================================================== */}
        {/* BAGIAN C: METODE PEMBAYARAN DI BAWAH PILIHAN PAKET         */}
        {/* ========================================================== */}
        <section
          aria-labelledby="section-pembayaran-title"
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--r-card)",
            border: "1.5px solid var(--border)",
            padding: "2rem",
            boxShadow: "var(--shadow-card)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--accent)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              C
            </span>
            <div>
              <h2
                id="section-pembayaran-title"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--fg)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Metode Pembayaran (Demo)
              </h2>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
                Pilih kanal pembayaran untuk simulasi langganan listing.
              </p>
            </div>
          </div>

          {/* PERINGATAN WAJIB DEMO */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              background: "#fef3c7",
              border: "1.5px solid #f59e0b",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              marginTop: "1rem",
              marginBottom: "1.5rem",
              color: "#92400e",
            }}
          >
            <WarningCircle size={22} weight="fill" color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.875rem", letterSpacing: "0.01em" }}>
                SIMULASI DEMO — TIDAK ADA PEMBAYARAN NYATA
              </div>
              <div style={{ fontSize: "0.8125rem", marginTop: "0.25rem", lineHeight: 1.45 }}>
                Ini adalah simulasi antarmuka frontend RentalKit. Tidak ada penarikan saldo, tidak memerlukan nomor kartu, PIN, ataupun OTP.
              </div>
            </div>
          </div>

          {/* Pilihan Metode Pembayaran */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.875rem", marginBottom: "1.5rem" }}>
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = selectedPayment === pm.id;
              const Icon = pm.id === "bank" ? Bank : pm.id === "qris" ? QrCode : Wallet;
              return (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "1rem",
                    borderRadius: "var(--r-input)",
                    border: isSelected ? "2px solid var(--accent)" : "1.5px solid var(--border)",
                    background: isSelected ? "rgba(5, 150, 105, 0.05)" : "var(--bg)",
                    cursor: "pointer",
                    transition: "all var(--dur-fast)",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: isSelected ? "var(--accent)" : "rgba(15,23,42,0.06)",
                      color: isSelected ? "#ffffff" : "var(--fg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} weight={isSelected ? "bold" : "regular"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--fg)" }}>
                      {pm.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--fg-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {pm.sublabel}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isSelected ? "var(--accent)" : "transparent",
                    }}
                  >
                    {isSelected && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ringkasan Paket Terpilih */}
          <div
            style={{
              background: "var(--bg-muted)",
              borderRadius: "var(--r-input)",
              padding: "1.25rem",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
              Ringkasan Pembayaran Demo
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>Paket Terpilih</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg)" }}>
                Paket {selectedPaket?.nama}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>Masa Aktif Listing</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg)" }}>
                {selectedPaket?.durasiLabel}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>Metode Demo</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg)" }}>
                {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label}
              </span>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg)" }}>
                Total Biaya Listing (Demo)
              </span>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent)" }}>
                {formatRupiah(selectedPaket?.harga ?? 0)}
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* BAGIAN D: TOMBOL PEMBAYARAN DAN SUBMIT                      */}
        {/* ========================================================== */}
        <section
          aria-labelledby="section-submit-title"
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--r-card)",
            border: "1.5px solid var(--border)",
            padding: "2rem",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--accent)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              D
            </span>
            <div>
              <h2
                id="section-submit-title"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--fg)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Konfirmasi Pembayaran & Pengajuan Barang
              </h2>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
                Lakukan simulasi pembayaran terlebih dahulu sebelum mengajukan barang ke katalog.
              </p>
            </div>
          </div>

          {/* STATUS PEMBAYARAN DEMO BERHASIL */}
          {paymentDone && paidAtDate && selectedPaket && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1.5px solid #059669",
                borderRadius: "var(--r-card)",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <CheckCircle size={28} weight="fill" color="#059669" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#065f46" }}>
                    Status Pembayaran Demo: BERHASIL
                  </span>
                  <span
                    style={{
                      background: "#059669",
                      color: "#ffffff",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "999px",
                    }}
                  >
                    Simulasi Sukses
                  </span>
                </div>

                <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#047857" }}>
                  Paket <strong>{selectedPaket.nama}</strong> ({selectedPaket.durasiLabel}) telah aktif secara simulatif.
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    background: "rgba(5, 150, 105, 0.12)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "6px",
                    marginTop: "0.75rem",
                    fontSize: "0.8125rem",
                    color: "#065f46",
                    fontWeight: 600,
                  }}
                >
                  <CalendarCheck size={16} weight="bold" />
                  Tanggal Kedaluwarsa Paket:{" "}
                  <strong>{calculateExpiryDate(paidAtDate, selectedPaket.durasiBulan)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Area Tombol Aksi */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {!paymentDone ? (
              <div>
                <button
                  type="button"
                  id="btn-sewakan-barang"
                  onClick={handlePicuPembayaran}
                  style={{
                    width: "100%",
                    padding: "1rem 1.5rem",
                    borderRadius: "var(--r-btn)",
                    background: "var(--accent)",
                    color: "#ffffff",
                    fontSize: "1rem",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
                    transition: "all var(--dur-fast)",
                  }}
                >
                  Sewakan Barang
                  <ArrowRight size={18} weight="bold" />
                </button>
                <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--fg-subtle)", marginTop: "0.5rem" }}>
                  Tekan untuk memunculkan konfirmasi simulasi pembayaran paket {selectedPaket?.nama}.
                </p>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  id="btn-submit-barang"
                  onClick={handleSubmitBarang}
                  style={{
                    width: "100%",
                    padding: "1rem 1.5rem",
                    borderRadius: "var(--r-btn)",
                    background: "#059669",
                    color: "#ffffff",
                    fontSize: "1.0625rem",
                    fontWeight: 800,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(5, 150, 105, 0.35)",
                    transition: "all var(--dur-fast)",
                  }}
                >
                  <CheckCircle size={20} weight="bold" />
                  Submit Barang Sekarang
                </button>
                <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#059669", marginTop: "0.5rem", fontWeight: 600 }}>
                  Pembayaran simulasi telah terkonfirmasi. Tekan tombol di atas untuk menyelesaikan pengajuan.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ========================================================== */}
      {/* MODAL 1: KONFIRMASI SIMULASI PEMBAYARAN                    */}
      {/* ========================================================== */}
      {showConfirmModal && selectedPaket && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 100,
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--r-card)",
              border: "1.5px solid var(--border)",
              maxWidth: "500px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(5, 150, 105, 0.12)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package size={18} weight="bold" />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)" }}>
                  Konfirmasi Simulasi Pembayaran
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--fg-subtle)",
                  padding: "0.25rem",
                }}
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Peringatan Demo di dalam Modal */}
            <div
              style={{
                background: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "6px",
                padding: "0.625rem 0.875rem",
                fontSize: "0.75rem",
                color: "#92400e",
                fontWeight: 600,
                marginBottom: "1.25rem",
              }}
            >
              ⚠️ SIMULASI DEMO — TIDAK ADA PEMBAYARAN NYATA
            </div>

            {/* Rincian Konfirmasi */}
            <div
              style={{
                background: "var(--bg-muted)",
                borderRadius: "var(--r-input)",
                padding: "1rem",
                marginBottom: "1.25rem",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--fg-muted)" }}>Barang:</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>{form.nama}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--fg-muted)" }}>Kategori:</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>
                  {form.kategori ? categoryLabels[form.kategori] : "-"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--fg-muted)" }}>Lokasi:</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>{form.lokasi}, Bandung</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--fg-muted)" }}>Paket Dipilih:</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>
                  {selectedPaket.nama} ({selectedPaket.durasiLabel})
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--fg-muted)" }}>Metode:</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>
                  {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label}
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px dashed var(--border)",
                  paddingTop: "0.5rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--fg)" }}>Total Simulasi:</span>
                <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--accent)" }}>
                  {formatRupiah(selectedPaket.harga)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--r-btn)",
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  color: "var(--fg-muted)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-konfirmasi-simulasi"
                onClick={handleConfirmSimulation}
                disabled={isProcessingDemoPay}
                style={{
                  flex: 2,
                  padding: "0.75rem",
                  borderRadius: "var(--r-btn)",
                  background: "var(--accent)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: isProcessingDemoPay ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
              >
                {isProcessingDemoPay ? (
                  "Memproses Simulasi..."
                ) : (
                  <>
                    <CheckCircle size={16} weight="bold" />
                    Konfirmasi Bayar Demo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: NOTIFIKASI PENGAJUAN BERHASIL (DEMO)              */}
      {/* ========================================================== */}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 100,
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--r-card)",
              border: "1.5px solid var(--border)",
              maxWidth: "520px",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#d1fae5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <CheckCircle size={36} weight="fill" />
            </div>

            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.625rem",
                borderRadius: "999px",
                background: "rgba(5, 150, 105, 0.12)",
                color: "var(--accent)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Pengajuan Sukses (Demo)
            </span>

            <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--fg)", margin: 0, letterSpacing: "-0.02em" }}>
              Barang Berhasil Diajukan!
            </h3>

            <p style={{ fontSize: "0.875rem", color: "var(--fg-muted)", marginTop: "0.5rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Listing barang kamu telah terdaftar dalam simulasi demo RentalKit. Mahasiswa lain di area UPI dapat melihat barang ini di katalog.
            </p>

            {/* Kartu Ringkasan Barang yang Diajukan */}
            <div
              style={{
                background: "var(--bg-muted)",
                borderRadius: "var(--r-card)",
                padding: "1rem",
                textAlign: "left",
                marginBottom: "1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt={form.nama}
                  style={{ width: "70px", height: "55px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: "70px",
                    height: "55px",
                    borderRadius: "6px",
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  <Camera size={24} weight="bold" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {form.nama}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--fg-subtle)" }}>
                  {form.lokasi}, Bandung · {form.kondisi}
                </div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--accent)", marginTop: "0.25rem" }}>
                  {formatRupiah(parseInt(form.hargaPerHari, 10) || 0)} / hari
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset hanya jika pengguna ingin membuat pengajuan baru
                  setPaymentDone(false);
                  setPaidAtDate(null);
                  setForm({
                    nama: "",
                    kategori: "",
                    hargaPerHari: "",
                    kondisi: "",
                    lokasi: "",
                    deskripsi: "",
                  });
                  setFotoPreview(null);
                  setFotoFileName("");
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--r-btn)",
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  color: "var(--fg-muted)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Ajukan Lagi
              </button>
              <Link
                href="/katalog"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--r-btn)",
                  background: "var(--accent)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
              >
                Lihat Katalog <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
