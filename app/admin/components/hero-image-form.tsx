"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createHeroImage } from "@/app/admin/hero-image-actions";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

type HeroImageFormProps = {
  onCreated?: () => void;
};

export function HeroImageForm({ onCreated }: HeroImageFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
      <h2
        id="hero-images-heading"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        Hero images
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Add a slide using a public image URL (file upload still needs storage wired
        to the API). Alt text helps accessibility.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitError(null);
          setSubmitting(true);
          const r = await createHeroImage({ imageUrl, alt });
          setSubmitting(false);
          if (r.ok) {
            setImageUrl("");
            setAlt("");
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";
            onCreated?.();
          } else {
            setSubmitError(r.error);
          }
        }}
      >
        {submitError ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="hero-image-url">
            Image URL
          </label>
          <input
            id="hero-image-url"
            name="imageUrl"
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={fieldClass}
            placeholder="https://example.com/banner.jpg"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="hero-alt">
            Alt text (accessibility)
          </label>
          <input
            id="hero-alt"
            name="alt"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className={fieldClass}
            placeholder="Describe the image for screen readers"
            maxLength={200}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-800">Upload file (preview only)</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="mt-1.5 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-8 text-center transition-colors hover:border-zinc-400"
          >
            <input
              ref={inputRef}
              id="hero-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFileChange}
              className="sr-only"
            />
            <label
              htmlFor="hero-image"
              className="cursor-pointer rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              Choose image
            </label>
            <p className="text-xs text-zinc-500">
              or drag and drop · JPEG, PNG, WebP, GIF · not saved to server yet
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
          disabled={submitting}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Add hero image"}
        </button>
      </form>
    </div>
  );
}
