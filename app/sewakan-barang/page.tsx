import type { Metadata } from "next";
import SewakanBarangClient from "./SewakanBarangClient";

export const metadata: Metadata = {
  title: "Sewakan Barang — RentalKit Mahasiswa",
  description:
    "Daftarkan barang Anda untuk disewakan kepada sesama mahasiswa di Bandung. Pilih paket listing fleksibel tanpa potongan komisi transaksi.",
};

export default function SewakanBarangPage() {
  return <SewakanBarangClient />;
}
