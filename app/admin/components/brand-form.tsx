"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600";

export function BrandForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const syncFileToPreview = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    syncFileToPreview(e.target.files?.[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !inputRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    inputRef.current.files = dt.files;
    syncFileToPreview(file);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form
      className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <section aria-labelledby="brand-form-heading">
        <div className="mb-5">
          <h3
            id="brand-form-heading"
            className="text-lg font-semibold tracking-tight text-zinc-900"
          >
            Add Brand
          </h3>
          <p className="text-sm text-zinc-600">
            Add a new brand to your store.
          </p>
        </div>

        <div className="mb-5">
          <label className={labelClass} htmlFor="brand-name">
            Name
          </label>
          <input
            type="text"
            id="brand-name"
            name="name"
            className={fieldClass}
            placeholder="e.g. ASUS"
            autoComplete="off"
          />
        </div>

        <div>
          <p className={labelClass}>Brand logo</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="mt-1.5 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-8 text-center transition-colors hover:border-zinc-400"
          >
            <input
              ref={inputRef}
              id="brand-logo-file"
              name="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFileChange}
              className="sr-only"
            />
            <label
              htmlFor="brand-logo-file"
              className="cursor-pointer rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              Choose image
            </label>
            <p className="text-xs text-zinc-500">
              or drag and drop · JPEG, PNG, WebP, GIF
            </p>
            {preview ? (
              <img
                src={preview}
                alt=""
                className="mt-2 max-h-40 w-auto max-w-full rounded-md border border-zinc-200 object-contain"
              />
            ) : null}
          </div>
        </div>

        <div className="relative my-6">
          <div
            className="absolute inset-x-0 top-1/2 border-t border-zinc-200"
            aria-hidden
          />
          <span className="relative mx-auto block w-fit bg-white px-2 text-xs text-zinc-500">
            or
          </span>
        </div>

        <div className="mb-6">
          <label className={labelClass} htmlFor="brand-logo-url">
            Logo URL
          </label>
          <input
            id="brand-logo-url"
            name="logoUrl"
            type="url"
            className={fieldClass}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Add brand
        </button>

        <p className="mt-4 text-xs text-zinc-500">
          Saving to your backend is not wired yet — this form is UI only for
          now.
        </p>
      </section>
    </form>
  );
}
