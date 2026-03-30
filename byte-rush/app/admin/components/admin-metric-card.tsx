import type { ReactElement } from "react";

function BoxGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M3 7 12 12l9-5M12 12v10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrderGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5v14"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M9 9h6M9 13h6M9 17h4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RevenueGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 18h16M4 18l5-6 4 4 5-9 4 5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4v4M10 6h4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 5a2 2 0 0 1 2-2h5l2 3h5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h8M8 15h5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LowStockGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M3 7 12 12l9-5M12 12v10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type MetricGlyphId = "products" | "orders" | "revenue" | "brands" | "lowStock";

const GLYPHS: Record<
  MetricGlyphId,
  (p: { className?: string }) => ReactElement
> = {
  products: BoxGlyph,
  orders: OrderGlyph,
  revenue: RevenueGlyph,
  brands: BrandGlyph,
  lowStock: LowStockGlyph,
};

export type AdminMetricItem = {
  label: string;
  value: string;
  subtext: string;
  glyph: MetricGlyphId;
};

/** Dashboard metric copy — edit here only. */
export const ADMIN_METRICS: AdminMetricItem[] = [
  {
    label: "Total products",
    value: "248",
    subtext: "↑ 12 added this week",
    glyph: "products",
  },
  {
    label: "Orders",
    value: "1,024",
    subtext: "↑ 8% vs last month",
    glyph: "orders",
  },
  {
    label: "Brands",
    value: "36",
    subtext: "2 new this month",
    glyph: "brands",
  },
  {
    label: "Low Stock",
    value: "12",
    subtext: "12 products below 10 in stock",
    glyph: "lowStock",
  },

];

export type AdminMetricCardProps = AdminMetricItem;

/**
 * Single metric card: icon + label + value + subtext (left), watermark (right), top stripe.
 */
export function AdminMetricCard({
  label,
  value,
  subtext,
  glyph,
}: AdminMetricCardProps) {
  const Icon = GLYPHS[glyph];
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white pt-0 shadow-sm">
      <div className="h-0.5 w-full bg-zinc-300" aria-hidden />
      <div className="relative z-10 p-6 pr-24">
        <Icon className="size-7 text-zinc-500" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
          {value}
        </p>
        <p className="mt-2 text-sm text-zinc-600">{subtext}</p>
      </div>
      <div
        className="pointer-events-none absolute -bottom-6 -right-4 text-zinc-900 opacity-[0.06]"
        aria-hidden
      >
        <Icon className="size-40" />
      </div>
    </div>
  );
}

/** Full row of metrics using {@link ADMIN_METRICS}. */
export function AdminMetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ADMIN_METRICS.map((m) => (
        <AdminMetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
