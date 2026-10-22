"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Package, List, X, ArrowRight } from "@phosphor-icons/react";

// Hanya 2 tautan teks — "Sewakan Barang" eksklusif sebagai tombol hijau
const navLinks = [
  { href: "/katalog", label: "Katalog" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        // Header lebih gelap — slate-900 dengan opacity tinggi, harmonis dengan hijau
        backgroundColor: "rgba(15, 23, 42, 0.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(5, 150, 105, 0.18)",
        boxShadow: "0 1px 0 0 rgba(5,150,105,0.10)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          aria-label="RentalKit — Beranda"
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              background: "var(--accent)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 2px rgba(5,150,105,0.25)",
            }}
          >
            <Package size={18} color="white" weight="bold" />
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            Rental<span style={{ color: "#34d399" }}>Kit</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Navigasi utama"
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => {
            const active = link.href === "/katalog" && pathname === "/katalog";
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "var(--r-btn)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: active ? "#34d399" : "rgba(248,250,252,0.75)",
                  background: active ? "rgba(5,150,105,0.15)" : "transparent",
                  transition: "background var(--dur-fast), color var(--dur-fast)",
                }}
                className="nav-link-dark"
              >
                {link.label}
              </Link>
            );
          })}

          {/* Satu-satunya CTA: tombol hijau Sewakan Barang */}
          <Link
            href="/sewakan-barang"
            id="nav-cta"
            style={{
              marginLeft: "0.75rem",
              padding: "0.5rem 1.125rem",
              borderRadius: "var(--r-btn)",
              fontSize: "0.875rem",
              fontWeight: 600,
              background: "var(--accent)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              transition: "background var(--dur-fast), box-shadow var(--dur-fast)",
              boxShadow: "0 0 0 0 rgba(5,150,105,0)",
            }}
            className="btn-nav-cta"
          >
            Sewakan Barang
            <ArrowRight size={14} weight="bold" />
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="md:hidden"
          style={{
            padding: "0.5rem",
            borderRadius: "var(--r-input)",
            color: "rgba(248,250,252,0.8)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            borderTop: "1px solid rgba(5,150,105,0.18)",
            background: "rgba(15,23,42,0.99)",
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--r-input)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "rgba(248,250,252,0.75)",
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* Tombol CTA mobile — satu saja */}
          <Link
            href="/sewakan-barang"
            onClick={() => setOpen(false)}
            style={{
              marginTop: "0.75rem",
              padding: "0.875rem 1rem",
              borderRadius: "var(--r-btn)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              background: "var(--accent)",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Sewakan Barang
          </Link>
        </div>
      )}

      <style jsx>{`
        .nav-link-dark:hover {
          background: rgba(248, 250, 252, 0.08);
          color: #f8fafc;
        }
        .btn-nav-cta:hover {
          background: var(--accent-dark);
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.3);
        }
      `}</style>
    </header>
  );
}
