"use client";

import { useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

type ProductStatus = "live" | "out_of_stock" | "draft";

type ProductRow = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
};

const SAMPLE_PRODUCTS: ProductRow[] = [
  {
    sku: "GPU-NV-5090",
    name: "RTX 5090 24G",
    category: "GPU",
    price: 89999,
    stock: 14,
    status: "live",
  },
  {
    sku: "GPU-AMD-79",
    name: "RX 7900 XTX",
    category: "GPU",
    price: 52999,
    stock: 0,
    status: "out_of_stock",
  },
  {
    sku: "CPU-INT-14K",
    name: "Core i9-14900K",
    category: "CPU",
    price: 24999,
    stock: 7,
    status: "live",
  },
  {
    sku: "CPU-AMD-79X",
    name: "Ryzen 9 7950X",
    category: "CPU",
    price: 28999,
    stock: 22,
    status: "draft",
  },
  {
    sku: "RAM-COR-V32",
    name: "Vengeance 32GB DDR5",
    category: "RAM",
    price: 7200,
    stock: 3,
    status: "live",
  },
  {
    sku: "SSD-SAM-990P",
    name: "990 Pro 2TB",
    category: "Storage",
    price: 12999,
    stock: 18,
    status: "live",
  },
  {
    sku: "MB-ASUS-B650E",
    name: "ROG Strix B650E-F",
    category: "Motherboard",
    price: 16999,
    stock: 5,
    status: "live",
  },
];

function statusDotClass(status: ProductStatus) {
  switch (status) {
    case "live":
      return "bg-emerald-500";
    case "out_of_stock":
      return "bg-red-500";
    case "draft":
      return "bg-amber-400";
    default:
      return "bg-zinc-300";
  }
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const label =
    status === "live"
      ? "Live"
      : status === "out_of_stock"
        ? "Out of stock"
        : "Draft";
  const cls =
    status === "live"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : status === "out_of_stock"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-zinc-200 bg-zinc-100 text-zinc-700";
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function ProductRowQuickActions({ sku }: { sku: string }) {
  return (
    <div
      role="group"
      aria-label={`Actions for ${sku}`}
      className="flex flex-col gap-1.5"
    >
      <button
        type="button"
        className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
        onClick={() => {
          /* wire to edit route / modal */
        }}
      >
        Edit
      </button>
      <button
        type="button"
        className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-50"
        onClick={() => {
          /* wire to delete confirm */
        }}
      >
        Delete
      </button>
    </div>
  );
}

export function ManageProductsForm() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((p) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const hay = `${p.name} ${p.sku} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category !== "all" && p.category !== category) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [search, category, statusFilter]);

  const totalItems = SAMPLE_PRODUCTS.length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            Edit / Manage products
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Search, update, or remove existing products.
          </p>
        </div>
        <div className="shrink-0 rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-800">
          {totalItems} items
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="manage-products-search">
            Search products
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              id="manage-products-search"
              type="search"
              className={`${fieldClass} pl-9`}
              placeholder="Search by name, SKU, or brand…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[22rem] lg:shrink-0">
          <div>
            <label className="sr-only" htmlFor="manage-products-category">
              Category
            </label>
            <select
              id="manage-products-category"
              className={fieldClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              <option value="GPU">GPU</option>
              <option value="CPU">CPU</option>
              <option value="RAM">RAM</option>
              <option value="Storage">Storage</option>
              <option value="Motherboard">Motherboard</option>
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="manage-products-status">
              Status
            </label>
            <select
              id="manage-products-status"
              className={fieldClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All status</option>
              <option value="live">Live</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-[56rem] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th
                scope="col"
                className="w-10 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                <span className="sr-only">Select</span>
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Stock
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.sku}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80"
              >
                <td className="px-3 py-3 align-top">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 text-zinc-900"
                    aria-label={`Select ${p.name}`}
                  />
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass(p.status)}`}
                      aria-hidden
                    />
                    <span className="font-medium text-zinc-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 align-top font-mono text-xs text-zinc-800">
                  {p.sku}
                </td>
                <td className="px-3 py-3 align-top text-zinc-700">{p.category}</td>
                <td className="px-3 py-3 align-top tabular-nums text-zinc-900">
                  ₱{p.price.toLocaleString("en-PH")}
                </td>
                <td className="px-3 py-3 align-top tabular-nums text-zinc-800">
                  {p.stock}
                </td>
                <td className="px-3 py-3 align-top">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-3 py-3 align-top">
                  <ProductRowQuickActions sku={p.sku} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            No products match your filters.
          </p>
        ) : null}
      </div>

      {/* Pagination (layout only) */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-4 sm:flex-row">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
            disabled
            aria-label="Previous page"
          >
            ←
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-900 bg-zinc-900 px-2.5 py-1 text-sm font-medium text-white"
          >
            1
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            2
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            3
          </button>
          <span className="px-1 text-zinc-400">…</span>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            24
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
            aria-label="Next page"
          >
            →
          </button>
        </div>
        <p className="text-sm text-zinc-600">
          Page 1 of 24 · {totalItems} items
        </p>
      </div>
    </div>
  );
}
