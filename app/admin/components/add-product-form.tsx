"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoryDropdown, type CategoryOption } from "@/app/admin/components/category-dropdown";
import { ItemTypeDropdown, type ItemTypeOption } from "./itemtype-dropdown";
import { BrandDropdown, type BrandOption } from "./brand-dropdown";
import { createItemType, deleteItemType } from "@/app/admin/item-type-actions";
import { RichTextEditor } from "./TextEditor";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {children}
      </span>
      <div className="h-px flex-1 bg-zinc-200" aria-hidden />
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7a2 2 0 0 1 2-2h2l1-2h6l1 2h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
      />
      <circle cx="12" cy="13" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function apiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}



export function AddProductForm() {
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[] | undefined>(undefined);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);


  const [itemTypeId, setItemTypeId] = useState("");
  const [itemTypes, setItemTypes] = useState<ItemTypeOption[]>([]);
  const [itemTypesLoading, setItemTypesLoading] = useState(false);
  const [itemTypesError, setItemTypesError] = useState<string | null>(null);
  
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState<BrandOption[] | undefined>(undefined);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  const [fullDescription, setFullDescription] = useState("<p></p>");


  const handleCreateItemType = useCallback(
    async (name: string) => {
      const catId = categoryId.trim();
      if (!catId) {
        return { ok: false as const, error: "Select a category first." };
      }

      const r = await createItemType({ categoryId: catId, name });
      if (!r.ok) {
        return r;
      }

      const added: ItemTypeOption = {
        id: r.item.id,
        slug: r.item.slug,
        name: r.item.name,
      };

      setItemTypes((prev) => {
        if (prev.some((p) => p.id === added.id)) return prev;
        return [...prev, added].sort((a, b) => a.name.localeCompare(b.name));
      });
      setItemTypeId(added.id);

      return { ok: true as const, item: added };
    },
    [categoryId],
  );

  const handleDeleteItemType = useCallback(
    async (id: string) => {
      const r = await deleteItemType(id);
      if (!r.ok) {
        return r;
      }

      setItemTypes((prev) => prev.filter((t) => t.id !== id));
      setItemTypeId((prev) => (prev === id ? "" : prev));
      return { ok: true as const };
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const base = apiBase();
      if (!base) {
        if (!cancelled) {
          setCategoriesError("Set NEXT_PUBLIC_BACKEND_URL in .env.local to load categories.");
          setCategories([]);
        }
        return;
      }
      try {
        const res = await fetch(`${base}/categories`);
        if (!res.ok) {
          if (!cancelled) {
            setCategoriesError(`Could not load categories (${res.status}).`);
            setCategories([]);
          }
          return;
        }
        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) {
          if (!cancelled) {
            setCategoriesError("Invalid categories response.");
            setCategories([]);
          }
          return;
        }
        const rows: CategoryOption[] = [];
        for (const raw of data) {
          if (!raw || typeof raw !== "object") continue;
          const o = raw as Record<string, unknown>;
          const id = typeof o.id === "string" ? o.id : "";
          const name = typeof o.name === "string" ? o.name : "";
          const slug = typeof o.slug === "string" ? o.slug : "";
          if (id && name && slug) rows.push({ id, name, slug });
        }
        if (!cancelled) {
          setCategories(rows);
          setCategoriesError(null);
        }
      } catch {
        if (!cancelled) {
          setCategoriesError("Could not reach the API.");
          setCategories([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!categoryId.trim()) {
      setItemTypes([]);
      setItemTypeId("");
      setItemTypesLoading(false);
      setItemTypesError(null);
      return;
    }
    (async () => {
      const base = apiBase();
      if (!base) {
        setItemTypesLoading(false);
        setItemTypes([]);
        return;
      }
      setItemTypesLoading(true);
      setItemTypesError(null);
      try {
        const q = new URLSearchParams({ categoryId: categoryId.trim() });
        const res = await fetch(`${base}/item-types?${q.toString()}`);
        if (!res.ok) {
          if (!cancelled) {
            setItemTypesError(`Could not load item types (${res.status}).`);
            setItemTypes([]);
            setItemTypesLoading(false);
          }
          return;
        }
        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) {
          if (!cancelled) {
            setItemTypesError("Invalid item types response.");
            setItemTypes([]);
            setItemTypesLoading(false);
          }
          return;
        }
        const rows: ItemTypeOption[] = [];
        for (const raw of data) {
          if (!raw || typeof raw !== "object") continue;
          const o = raw as Record<string, unknown>;
          const id = typeof o.id === "string" ? o.id : "";
          const name = typeof o.name === "string" ? o.name : "";
          const slug = typeof o.slug === "string" ? o.slug : "";
          if (id && name && slug) rows.push({ id, name, slug });
        }
        if (!cancelled) {
          setItemTypes(rows);
          setItemTypeId("");
          setItemTypesLoading(false);
        }
      } catch {
        if (!cancelled) {
          setItemTypesError("Could not reach the API.");
          setItemTypes([]);
          setItemTypesLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const base = apiBase();
      if (!base) {
        if (!cancelled) {
          setBrandsError("Set NEXT_PUBLIC_BACKEND_URL in .env.local to load brands.");
          setBrands([]);
        }
        return;
      }
      setBrandsError(null);
      try {
        const res = await fetch(`${base}/brands`);
        if (!res.ok) {
          if (!cancelled) {
            setBrandsError(`Could not load brands (${res.status}).`);
            setBrands([]);
          }
          return;
        }
        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) {
          if (!cancelled) {
            setBrandsError("Invalid brands response.");
            setBrands([]);
          }
          return;
        }
        const rows: BrandOption[] = [];
        for (const raw of data) {
          if (!raw || typeof raw !== "object") continue;
          const o = raw as Record<string, unknown>;
          const id = typeof o.id === "string" ? o.id : "";
          const name = typeof o.name === "string" ? o.name : "";
          const slug = typeof o.slug === "string" ? o.slug : "";
          if (id && name && slug) rows.push({ id, name, slug });
        }
        if (!cancelled) {
          setBrands(rows);
          setBrandsError(null);
        }
      } catch {
        if (!cancelled) {
          setBrandsError("Could not reach the API.");
          setBrands([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <form
      className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Basic info */}
      <section aria-labelledby="basic-info-heading">
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
            Add Product
          </h3>
          <p className="text-sm text-zinc-600">
            Add a new product to your store.
          </p>
        </div>

        <h2 id="basic-info-heading" className="sr-only">
          Basic info
        </h2>
        <SectionTitle>Basic info</SectionTitle>

        {categoriesError ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {categoriesError}
          </p>
        ) : null}
        {itemTypesError && categoryId ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {itemTypesError}
          </p>
        ) : null}
        {brandsError ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {brandsError}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <label className={labelClass} htmlFor="product-name">
              Product name
            </label>
            <input
              id="product-name"
              name="productName"
              type="text"
              className={fieldClass}
              placeholder="e.g. NVIDIA GeForce RTX 5090"
              autoComplete="off"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-sku">
              SKU / Model no.
            </label>
            <input
              id="product-sku"
              name="sku"
              type="text"
              className={fieldClass}
              placeholder="e.g. GPU-NV-5090-24G"
              autoComplete="off"
            />
          </div>
          <CategoryDropdown
            id="product-category"
            name="categoryId"
            categories={categories ?? []}
            loading={categories === undefined}
            value={categoryId}
            onValueChange={(id) => {
              setCategoryId(id);
              setItemTypeId("");
            }}
          />
          <ItemTypeDropdown
            id="product-item-type"
            name="itemTypeId"
            itemTypes={itemTypes}
            loading={categories === undefined || itemTypesLoading}
            value={itemTypeId}
            onValueChange={setItemTypeId}
            onCreateType={handleCreateItemType}
            onDeleteType={handleDeleteItemType}
            canManageTypes={Boolean(categoryId.trim())}
            disabled={!categoryId.trim()}
          />
          <BrandDropdown
            id="product-brand"
            name="brandId"
            brands={brands ?? []}
            loading={brands === undefined}
            value={brandId}
            placeholder="Brand required"
            onValueChange={setBrandId}
            required
          />
        </div>

        <div className="mt-4 md:mt-6">
          <RichTextEditor value={fullDescription} onChange={setFullDescription} />
          <input type="hidden" name="fullDescription" value={fullDescription} />
        </div>
      </section>

      {/* Pricing & inventory */}
      <section className="mt-10 pt-10 border-t border-zinc-200" aria-labelledby="pricing-heading">
        <h2 id="pricing-heading" className="sr-only">
          Pricing and inventory
        </h2>
        <SectionTitle>Pricing &amp; inventory</SectionTitle>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <label className={labelClass} htmlFor="regular-price">
              Regular price
            </label>
            <input
              id="regular-price"
              name="regularPrice"
              type="text"
              inputMode="decimal"
              className={fieldClass}
              placeholder="₱ 0.00"
              autoComplete="off"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="sale-price">
              Sale price
            </label>
            <input
              id="sale-price"
              name="salePrice"
              type="text"
              inputMode="decimal"
              className={fieldClass}
              placeholder="₱ 0.00"
              autoComplete="off"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="stock-qty">
              Stock quantity
            </label>
            <input
              id="stock-qty"
              name="stockQuantity"
              type="number"
              min={0}
              className={fieldClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="low-stock">
              Low stock alert
            </label>
            <input
              id="low-stock"
              name="lowStockAlert"
              type="number"
              min={0}
              className={fieldClass}
              placeholder="5"
            />
          </div>
        </div>
      </section>

      {/* Product images */}
      <section className="mt-10 pt-10 border-t border-zinc-200" aria-labelledby="images-heading">
        <h2 id="images-heading" className="sr-only">
          Product images
        </h2>
        <SectionTitle>Product images</SectionTitle>

        <input
          type="file"
          name="productImages"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="sr-only"
          id="product-images"
        />
        <label
          htmlFor="product-images"
          className="flex min-h-[11rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-10 text-center transition-colors hover:border-zinc-400"
        >
          <CameraIcon className="h-8 w-8 text-zinc-500" />
          <span className="text-sm font-semibold text-zinc-900">
            Upload product photos
          </span>
          <span className="max-w-sm text-xs text-zinc-500">
            First image becomes thumbnail · PNG, JPG, WebP · Max 2MB each
          </span>
        </label>

        <div className="mt-3 flex flex-wrap items-start gap-2">
          <label
            htmlFor="product-images"
            className="flex aspect-square w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/80 text-xl font-light text-zinc-500 transition-colors hover:border-zinc-400"
            title="Add more images"
          >
            <span aria-hidden>+</span>
            <span className="sr-only">Add more images</span>
          </label>
        </div>
      </section>

      <div className="mt-8 flex justify-end gap-3 border-t border-zinc-200 pt-6">
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Save product
        </button>
      </div>
    </form>
  );
}
