"use client";

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

export function AddProductForm() {
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
          <div>
            <label className={labelClass} htmlFor="product-category">
              Category
            </label>
            <select
              id="product-category"
              name="category"
              className={fieldClass}
              defaultValue=""
            >
              <option value="" disabled>
                — Select category —
              </option>
              <option value="components">Components</option>
              <option value="peripherals">Peripherals</option>
              <option value="laptops">Laptops</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="product-brand">
              Brand
            </label>
            <select
              id="product-brand"
              name="brand"
              className={fieldClass}
              defaultValue=""
            >
              <option value="" disabled>
                — Select brand —
              </option>
              <option value="placeholder-a">Brand A</option>
              <option value="placeholder-b">Brand B</option>
            </select>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <label className={labelClass} htmlFor="short-description">
            Short description
          </label>
          <textarea
            id="short-description"
            name="shortDescription"
            rows={3}
            className={`${fieldClass} resize-y min-h-[4.5rem]`}
            placeholder="Brief product overview (shown in search results and cards)…"
          />
        </div>

        <div className="mt-4 md:mt-6">
          <label className={labelClass} htmlFor="full-description">
            Full description
          </label>
          <textarea
            id="full-description"
            name="fullDescription"
            rows={8}
            className={`${fieldClass} resize-y min-h-[12rem]`}
            placeholder="Detailed product description with features, specs overview, and highlights…"
          />
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
