"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlass, Funnel, ArrowsDownUp, X } from "@phosphor-icons/react";
import { barangList, categoryLabels, type Category } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const CATEGORIES: (Category | "semua")[] = [
  "semua",
  "kamera",
  "tripod",
  "mikrofon",
  "printer",
  "proyektor",
];

const SORT_OPTIONS = [
  { value: "default", label: "Urutan Default" },
  { value: "price-asc",  label: "Harga: Termurah" },
  { value: "price-desc", label: "Harga: Termahal" },
];

export default function KatalogClient() {
  const searchParams = useSearchParams();

  const [query, setQuery]     = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<Category | "semua">(
    (searchParams.get("kategori") as Category) ?? "semua"
  );
  const [sort, setSort]       = useState("default");

  // Sync URL params on first mount / navigation
  useEffect(() => {
    const q   = searchParams.get("q");
    const cat = searchParams.get("kategori");
    if (q)   setQuery(q);
    if (cat) setCategory(cat as Category);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...barangList];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== "semua") {
      list = list.filter((b) => b.category === category);
    }

    // Sort
    if (sort === "price-asc")  list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "price-desc") list.sort((a, b) => b.pricePerDay - a.pricePerDay);

    return list;
  }, [query, category, sort]);

  const hasFilters = query.trim() !== "" || category !== "semua";

  function clearFilters() {
    setQuery("");
    setCategory("semua");
    setSort("default");
  }

  return (
    <>
      {/* ── Page header ─────────────────────────── */}
      <div
        style={{
          padding: "3rem 1.5rem 2rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            marginBottom: "0.5rem",
          }}
        >
          Katalog Barang
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--fg-muted)" }}>
          {barangList.length} barang tersedia dari mahasiswa Bandung &mdash; data demonstrasi.
        </p>
      </div>

      {/* ── Filters ─────────────────────────────── */}
      <div
        style={{
          padding: "0 1.5rem 1.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Row 1: Search + Sort */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Search */}
          <div
            style={{
              flex: "1 1 240px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--r-input)",
              padding: "0 0.875rem",
              transition: "border-color var(--dur-fast)",
            }}
            className="search-wrap"
          >
            <label htmlFor="katalog-search" style={{ display: "flex", alignItems: "center" }}>
              <MagnifyingGlass size={16} color="var(--fg-subtle)" />
              <span className="sr-only">Cari barang</span>
            </label>
            <input
              id="katalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, kategori, atau lokasi..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.9375rem",
                color: "var(--fg)",
                padding: "0.75rem 0",
              }}
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-subtle)", padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--r-input)",
              padding: "0 0.875rem",
              minWidth: "200px",
            }}
          >
            <ArrowsDownUp size={16} color="var(--fg-subtle)" style={{ flexShrink: 0 }} />
            <label htmlFor="katalog-sort" className="sr-only">Urutan</label>
            <select
              id="katalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.9rem",
                color: "var(--fg)",
                padding: "0.75rem 0",
                cursor: "pointer",
                appearance: "none",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Category pills */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Funnel size={16} color="var(--fg-subtle)" style={{ flexShrink: 0 }} aria-hidden="true" />
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={active}
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "var(--r-btn)",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 500,
                  border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  background: active ? "var(--accent)" : "var(--bg-card)",
                  color: active ? "var(--accent-fg)" : "var(--fg-muted)",
                  cursor: "pointer",
                  transition: "all var(--dur-fast)",
                  whiteSpace: "nowrap",
                }}
              >
                {cat === "semua" ? "Semua Kategori" : categoryLabels[cat as Category]}
              </button>
            );
          })}

          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.375rem 0.75rem",
                borderRadius: "var(--r-btn)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                border: "1.5px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--fg-muted)",
                cursor: "pointer",
              }}
            >
              <X size={13} />
              Hapus filter
            </button>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────── */}
      <div
        style={{
          padding: "0 1.5rem 5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Result count */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--fg-subtle)",
            marginBottom: "1.25rem",
          }}
        >
          {filtered.length === 0
            ? "Tidak ada barang yang cocok."
            : `Menampilkan ${filtered.length} barang`}
        </p>

        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filtered.map((barang) => (
              <ProductCard key={barang.id} barang={barang} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 1.5rem",
              background: "var(--bg-card)",
              borderRadius: "var(--r-card)",
              border: "1px dashed var(--border)",
            }}
          >
            <MagnifyingGlass size={40} color="var(--fg-subtle)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--fg)", marginBottom: "0.5rem" }}>
              Barang tidak ditemukan
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "var(--fg-muted)", maxWidth: "36ch", margin: "0 auto 1.5rem" }}>
              Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "var(--r-btn)",
                background: "var(--accent)",
                color: "var(--accent-fg)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Tampilkan semua barang
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-wrap:focus-within {
          border-color: var(--accent);
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
