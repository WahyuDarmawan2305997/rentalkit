// lib/data.ts — Sumber data demonstrasi untuk RentalKit
// Semua harga, lokasi, pemilik, dan ketersediaan adalah data demonstrasi, bukan data terverifikasi.
// Lokasi mengacu pada area sekitar Universitas Pendidikan Indonesia (UPI), Bandung.

export type Category =
  | "kamera"
  | "tripod"
  | "mikrofon"
  | "printer"
  | "proyektor";

export interface Owner {
  name: string;
  campus: string;
  phone: string;
  rating: number;
  totalSewa: number;
  avatar: string;
}

export interface Barang {
  id: string;
  slug: string;
  name: string;
  category: Category;
  pricePerDay: number;
  condition: "Baru" | "Sangat Baik" | "Baik" | "Cukup";
  location: string;
  description: string;
  specs: { label: string; value: string }[];
  terms: string[];
  images: string[];
  owner: Owner;
  available: boolean;
  featured: boolean;
}

// Lokasi demo: area sekitar UPI Bandung
const UPI_LOCATIONS = [
  "Gegerkalong, Bandung",
  "Geger Arum, Bandung",
  "KPAD, Bandung",
  "Ledeng, Bandung",
  "Cilimus, Bandung",
  "Sersan Bajuri, Bandung",
] as const;

const owners: Owner[] = [
  {
    name: "Rizky Pratama",
    campus: "UPI, Gegerkalong",
    phone: "0812-xxxx-xxxx",
    rating: 4.9,
    totalSewa: 42,
    avatar: "https://picsum.photos/seed/owner-rizky/80/80",
  },
  {
    name: "Sari Dewi",
    campus: "UPI, KPAD",
    phone: "0821-xxxx-xxxx",
    rating: 4.8,
    totalSewa: 31,
    avatar: "https://picsum.photos/seed/owner-sari/80/80",
  },
  {
    name: "Budi Santoso",
    campus: "UPI, Ledeng",
    phone: "0857-xxxx-xxxx",
    rating: 4.7,
    totalSewa: 19,
    avatar: "https://picsum.photos/seed/owner-budi/80/80",
  },
  {
    name: "Aulia Rahman",
    campus: "UPI, Geger Arum",
    phone: "0878-xxxx-xxxx",
    rating: 4.6,
    totalSewa: 27,
    avatar: "https://picsum.photos/seed/owner-aulia/80/80",
  },
  {
    name: "Dian Fitri",
    campus: "UPI, Cilimus",
    phone: "0831-xxxx-xxxx",
    rating: 4.9,
    totalSewa: 55,
    avatar: "https://picsum.photos/seed/owner-dian/80/80",
  },
];

// Gambar produk: menggunakan Unsplash Source via picsum dengan seed deskriptif per kategori.
// Karena picsum mengacak berdasarkan seed, gambar mungkin tidak selalu persis produk —
// namun seed dipilih agar temanya relevan (kamera, mikrofon, dll).
// Alternatif statis menggunakan placeholder.com dengan label kategori.

export const barangList: Barang[] = [
  // ── KAMERA ──────────────────────────────────────────
  {
    id: "brg-001",
    slug: "canon-eos-m50-mark-ii",
    name: "Canon EOS M50 Mark II",
    category: "kamera",
    pricePerDay: 150000,
    condition: "Sangat Baik",
    location: "Gegerkalong, Bandung",
    description:
      "Kamera mirrorless Canon EOS M50 Mark II cocok untuk vlog, konten sosmed, dan keperluan tugas kuliah. Sensor APS-C 24.1 MP, layar flip touchscreen, dan konektivitas Wi-Fi & Bluetooth. Tersedia lengkap dengan lensa kit 15-45mm, baterai cadangan, dan memory card 32 GB.",
    specs: [
      { label: "Sensor", value: "APS-C 24.1 MP" },
      { label: "Video", value: "4K (crop) / Full HD 60fps" },
      { label: "Layar", value: "3\" Flip Touchscreen" },
      { label: "Lensa", value: "Kit 15-45mm (termasuk)" },
      { label: "Baterai", value: "2× LP-E12" },
      { label: "Memori", value: "SD 32 GB (termasuk)" },
    ],
    terms: [
      "Barang dikembalikan dalam kondisi semula",
      "Wajib membayar uang jaminan Rp 300.000",
      "Kerusakan akibat kelalaian ditanggung penyewa",
      "Pengambilan dan pengembalian di lokasi pemilik",
      "Keterlambatan dikenakan denda Rp 50.000/hari",
    ],
    // Gambar kamera: foto kamera yang relevan dan nyata
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[0],
    available: true,
    featured: true,
  },
  {
    id: "brg-002",
    slug: "sony-zv-e10",
    name: "Sony ZV-E10",
    category: "kamera",
    pricePerDay: 130000,
    condition: "Baik",
    location: "KPAD, Bandung",
    description:
      "Sony ZV-E10 adalah kamera vlog mirrorless berdesain ramping dengan deteksi wajah real-time, mode bokeh otomatis, dan microphone bawaan terarah. Cocok untuk presentasi, dokumentasi kegiatan kampus, dan short video.",
    specs: [
      { label: "Sensor", value: "APS-C 24.2 MP" },
      { label: "Video", value: "Full HD 120fps / 4K 30fps" },
      { label: "Mikrofon", value: "3-capsule built-in" },
      { label: "Lensa", value: "16-50mm (termasuk)" },
      { label: "Baterai", value: "NP-FW50" },
    ],
    terms: [
      "Jangan ubah pengaturan kamera",
      "Uang jaminan Rp 250.000",
      "Dikembalikan dengan semua aksesori lengkap",
      "Denda keterlambatan Rp 40.000/hari",
    ],
    images: [
      "https://images.unsplash.com/photo-1510127031490-769773362b78?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[1],
    available: true,
    featured: true,
  },

  // ── TRIPOD ──────────────────────────────────────────
  {
    id: "brg-003",
    slug: "joby-gorillapod-5k",
    name: "Joby GorillaPod 5K",
    category: "tripod",
    pricePerDay: 45000,
    condition: "Sangat Baik",
    location: "Geger Arum, Bandung",
    description:
      "Tripod fleksibel Joby GorillaPod 5K dengan kaki yang bisa dililit di berbagai permukaan. Ringan dan portabel, cocok untuk fotografi outdoor, konten kreatif, dan presentasi. Kapasitas beban hingga 5 kg.",
    specs: [
      { label: "Kapasitas", value: "5 kg" },
      { label: "Bahan", value: "Aluminum + ABS" },
      { label: "Tinggi", value: "Fleksibel (dapat ditekuk)" },
      { label: "Kepala", value: "Ball head 360 derajat" },
    ],
    terms: [
      "Dikembalikan dalam kondisi bersih",
      "Tanggung jawab kerusakan pada penyewa",
      "Uang jaminan Rp 100.000",
    ],
    images: [
      "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[0],
    available: true,
    featured: false,
  },
  {
    id: "brg-004",
    slug: "vanguard-alta-pro-263ab",
    name: "Vanguard Alta Pro 263AB",
    category: "tripod",
    pricePerDay: 60000,
    condition: "Baik",
    location: "Ledeng, Bandung",
    description:
      "Tripod full-size Vanguard Alta Pro 263AB dengan sudut multi-angle dan kepala ball head. Tinggi maksimal 185 cm, cocok untuk fotografi portrait, produk, dan video interview.",
    specs: [
      { label: "Tinggi Maks", value: "185 cm" },
      { label: "Kapasitas", value: "8 kg" },
      { label: "Kaki", value: "Carbon fiber" },
      { label: "Kepala", value: "Ball head ABH-230" },
    ],
    terms: [
      "Pengambilan dan pengembalian di lokasi pemilik",
      "Uang jaminan Rp 150.000",
      "Denda keterlambatan Rp 20.000/hari",
    ],
    images: [
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[1],
    available: true,
    featured: true,
  },

  // ── MIKROFON ────────────────────────────────────────
  {
    id: "brg-005",
    slug: "rode-videomic-pro-plus",
    name: "Rode VideoMic Pro+",
    category: "mikrofon",
    pricePerDay: 80000,
    condition: "Sangat Baik",
    location: "Cilimus, Bandung",
    description:
      "Mikrofon shotgun Rode VideoMic Pro+ berkualitas broadcast untuk perekaman video dan podcast. Dilengkapi dead cat windscreen, shock mount terintegrasi, dan daya baterai AA yang tahan lama.",
    specs: [
      { label: "Pola", value: "Supercardioid" },
      { label: "Frekuensi", value: "20 Hz - 20 kHz" },
      { label: "Daya", value: "2x AA atau USB-C" },
      { label: "Koneksi", value: "3.5mm TRS" },
      { label: "Aksesori", value: "Dead cat, kabel, tas" },
    ],
    terms: [
      "Jangan simpan di tempat lembab",
      "Uang jaminan Rp 200.000",
      "Dikembalikan dengan semua aksesori lengkap",
    ],
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[3],
    available: true,
    featured: true,
  },
  {
    id: "brg-006",
    slug: "boya-by-m1-lavalier",
    name: "Boya BY-M1 Lavalier",
    category: "mikrofon",
    pricePerDay: 35000,
    condition: "Baik",
    location: "Sersan Bajuri, Bandung",
    description:
      "Mikrofon clip-on Boya BY-M1 yang ringan dan mudah digunakan. Cocok untuk wawancara, presentasi, dan perekaman suara langsung. Kabel 6 meter, bisa digunakan di kamera, ponsel, dan recorder.",
    specs: [
      { label: "Pola", value: "Omnidirectional" },
      { label: "Panjang kabel", value: "6 meter" },
      { label: "Koneksi", value: "3.5mm TRS/TRRS" },
      { label: "Baterai", value: "LR44 (termasuk)" },
    ],
    terms: [
      "Kabel dijaga agar tidak kusut",
      "Uang jaminan Rp 50.000",
    ],
    images: [
      "https://images.unsplash.com/photo-1520523839898-5071270559f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[4],
    available: true,
    featured: false,
  },

  // ── PRINTER ─────────────────────────────────────────
  {
    id: "brg-007",
    slug: "epson-l3210-printer",
    name: "Epson L3210 (All-in-One)",
    category: "printer",
    pricePerDay: 70000,
    condition: "Baik",
    location: "Gegerkalong, Bandung",
    description:
      "Printer all-in-one Epson L3210 dengan tangki tinta terintegrasi. Bisa print, scan, dan copy. Cocok untuk mencetak tugas akhir, laporan, dan materi kuliah dalam jumlah banyak. Tinta sudah terisi penuh.",
    specs: [
      { label: "Fungsi", value: "Print, Scan, Copy" },
      { label: "Resolusi Print", value: "5760 x 1440 dpi" },
      { label: "Kecepatan", value: "10 ipm (hitam)" },
      { label: "Koneksi", value: "USB 2.0" },
      { label: "Tinta", value: "Sudah terisi (termasuk)" },
    ],
    terms: [
      "Pemakaian tinta wajar tidak dikenakan biaya",
      "Kerusakan akibat penggunaan tidak wajar ditanggung penyewa",
      "Uang jaminan Rp 200.000",
      "Antar-jemput tersedia dalam area Gegerkalong",
    ],
    images: [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[2],
    available: true,
    featured: true,
  },

  // ── PROYEKTOR ───────────────────────────────────────
  {
    id: "brg-008",
    slug: "epson-eb-s41-proyektor",
    name: "Epson EB-S41 Proyektor",
    category: "proyektor",
    pricePerDay: 120000,
    condition: "Sangat Baik",
    location: "KPAD, Bandung",
    description:
      "Proyektor Epson EB-S41 berkekuatan 3300 lumens, cukup terang untuk ruangan dengan pencahayaan sedang. Resolusi SVGA 800x600, koneksi HDMI dan VGA. Tersedia kabel, remote, dan tas bawaan. Cocok untuk seminar, presentasi kelas, dan acara kampus.",
    specs: [
      { label: "Kecerahan", value: "3300 lumens" },
      { label: "Resolusi", value: "800 x 600 (SVGA)" },
      { label: "Rasio Proyeksi", value: "1.44:1 - 1.73:1" },
      { label: "Koneksi", value: "HDMI, VGA, USB-A" },
      { label: "Aksesori", value: "Kabel HDMI + VGA, remote, tas" },
    ],
    terms: [
      "Jangan ubah pengaturan lampu",
      "Dinginkan projektor sebelum disimpan",
      "Uang jaminan Rp 400.000",
      "Keterlambatan dikenakan denda Rp 80.000/hari",
    ],
    images: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    ],
    owner: owners[2],
    available: true,
    featured: true,
  },
];

export function getBarangBySlug(slug: string): Barang | undefined {
  return barangList.find((b) => b.slug === slug);
}

export function getFeaturedBarang(limit = 6): Barang[] {
  return barangList.filter((b) => b.featured).slice(0, limit);
}

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export const categoryLabels: Record<Category, string> = {
  kamera:    "Kamera",
  tripod:    "Tripod",
  mikrofon:  "Mikrofon",
  printer:   "Printer",
  proyektor: "Proyektor",
};

// ── Sumber Data Paket Langganan Sewakan Barang ────────
export interface PaketSewa {
  id: "bulanan" | "6bulan" | "tahunan";
  nama: string;
  durasiBulan: number;
  durasiLabel: string;
  harga: number;
  deskripsi: string;
  isPalingHemat?: boolean;
  hematLabel?: string;
}

export const PAKET_SEWA: PaketSewa[] = [
  {
    id: "bulanan",
    nama: "Bulanan",
    durasiBulan: 1,
    durasiLabel: "1 Bulan",
    harga: 10000,
    deskripsi: "Cocok untuk mencoba menyewakan barang dalam jangka pendek.",
  },
  {
    id: "6bulan",
    nama: "6 Bulan",
    durasiBulan: 6,
    durasiLabel: "6 Bulan",
    harga: 50000,
    deskripsi: "Hemat Rp 10.000 dibanding per bulan. Pilihan populer mahasiswa.",
    hematLabel: "Hemat 17%",
  },
  {
    id: "tahunan",
    nama: "Tahunan",
    durasiBulan: 12,
    durasiLabel: "12 Bulan",
    harga: 70000,
    deskripsi: "Hanya ~Rp 5.800/bulan! Listing aktif setahun penuh tanpa repot perpanjang.",
    isPalingHemat: true,
    hematLabel: "Paling Hemat",
  },
];

// Fallback gambar SVG kategori yang relevan dan elegan jika gambar gagal dimuat
export function getCategoryFallbackImage(category: Category, title?: string): string {
  const catNames: Record<Category, string> = {
    kamera: "Kamera",
    tripod: "Tripod",
    mikrofon: "Mikrofon",
    printer: "Printer",
    proyektor: "Proyektor",
  };
  const categoryName = catNames[category] || "Barang";
  const itemTitle = (title || categoryName).slice(0, 32);

  // SVG self-contained data URI dengan warna tema RentalKit
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
    <rect width="800" height="600" fill="#0f172a"/>
    <circle cx="400" cy="250" r="90" fill="#059669" fill-opacity="0.16"/>
    <circle cx="400" cy="250" r="60" stroke="#10b981" stroke-width="3" stroke-dasharray="6 6"/>
    <text x="400" y="260" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="34" font-weight="700" text-anchor="middle">${categoryName.toUpperCase()}</text>
    <text x="400" y="380" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="24" font-weight="600" text-anchor="middle">${itemTitle}</text>
    <text x="400" y="420" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="16" text-anchor="middle">RentalKit Mahasiswa • Bandung</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 6 Lokasi UPI Bandung
export const LOKASI_UPI = [
  "Gegerkalong",
  "Geger Arum",
  "KPAD",
  "Ledeng",
  "Cilimus",
  "Sersan Bajuri",
] as const;

export { UPI_LOCATIONS };
