"use client";

import Link from "next/link";
import { MapPin, Star } from "@phosphor-icons/react";
import type { Barang } from "@/lib/data";
import { formatRupiah, categoryLabels, getCategoryFallbackImage } from "@/lib/data";

interface ProductCardProps {
  barang: Barang;
}

const conditionColors: Record<string, string> = {
  "Baru":        "#059669",
  "Sangat Baik": "#0284c7",
  "Baik":        "#d97706",
  "Cukup":       "#dc2626",
};

export default function ProductCard({ barang }: ProductCardProps) {
  return (
    <Link
      href={`/barang/${barang.slug}`}
      style={{
        display: "block",
        background: "var(--bg-card)",
        borderRadius: "var(--r-card)",
        border: "1.5px solid var(--border)",
        overflow: "hidden",
        boxShadow: "0 2px 8px -2px rgb(15 23 42 / 0.08), 0 1px 2px 0 rgb(15 23 42 / 0.04)",
        transition: "box-shadow var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out), border-color var(--dur-med)",
        textDecoration: "none",
        color: "inherit",
      }}
      className="product-card"
      aria-label={`Lihat detail ${barang.name}`}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "var(--bg-muted)" }}>
        <img
          src={barang.images[0]}
          alt={barang.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform var(--dur-med) var(--ease-out)" }}
          className="card-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getCategoryFallbackImage(
              barang.category,
              barang.name
            );
          }}
        />
        {/* Category badge */}
        <span
          style={{
            position: "absolute",
            top: "0.625rem",
            left: "0.625rem",
            background: "rgba(15,23,42,0.75)",
            color: "#f8fafc",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            padding: "0.25rem 0.5rem",
            borderRadius: "999px",
            backdropFilter: "blur(6px)",
          }}
        >
          {categoryLabels[barang.category]}
        </span>
        {/* Condition badge */}
        <span
          style={{
            position: "absolute",
            top: "0.625rem",
            right: "0.625rem",
            background: conditionColors[barang.condition] + "22",
            color: conditionColors[barang.condition],
            border: `1px solid ${conditionColors[barang.condition]}44`,
            fontSize: "0.6875rem",
            fontWeight: 600,
            padding: "0.25rem 0.5rem",
            borderRadius: "999px",
            backdropFilter: "blur(6px)",
          }}
        >
          {barang.condition}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--fg)",
            marginBottom: "0.375rem",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {barang.name}
        </h3>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.8125rem",
            color: "var(--fg-subtle)",
            marginBottom: "0.875rem",
          }}
        >
          <MapPin size={13} weight="fill" />
          <span
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {barang.location}
          </span>
        </div>

        {/* Price + Owner rating */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--fg-subtle)" }}>Mulai dari</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
              <span
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                {formatRupiah(barang.pricePerDay)}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--fg-subtle)" }}>/hari</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.8125rem",
              color: "var(--fg-muted)",
            }}
          >
            <Star size={14} weight="fill" style={{ color: "#f59e0b" }} />
            <span style={{ fontWeight: 600 }}>{barang.owner.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
