"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600";


function apiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/+$/, ""); // Remove trailing slashes
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}


export function BrandForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

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

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setSubmitError(null);
  setSubmitSuccess(null);

  const formEl = e.currentTarget;
  const formData = new FormData(formEl);
  const nameRaw = formData.get("name");
  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";

  if (!name) {
    setSubmitError("Brand name is required.");
    return;
  }

  const slug = slugify(name);
  if (!slug) {
    setSubmitError("Could not generate a valid slug from this name.");
    return;
  }

  const base = apiBase();
  if (!base) {
    setSubmitError("Set NEXT_PUBLIC_BACKEND_URL in .env.local.");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await fetch(`${base}/brands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    if (!response.ok) {
      let message = `Failed to create brand (${response.status}).`;
      try {
        const data = (await response.json()) as { error?: string };
        if (data?.error) message = data.error;
      } catch {}
      setSubmitError(message);
      return;
    }

    formEl.reset();
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setSubmitSuccess("Brand added successfully.");
  } catch {
    setSubmitError("Network error while creating brand.");
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form
      className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6"
      onSubmit={handleSubmit}
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

        <div className="mb-5">
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


        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add brand"}
        </button>

        {submitError ? (
          <p className="mt-4 text-xs text-red-600">{submitError}</p>
        ) : null}

        {submitSuccess ? (
          <p className="mt-4 text-xs text-emerald-700">{submitSuccess}</p>
        ) : null}
      </section>
    </form>
  );
}
