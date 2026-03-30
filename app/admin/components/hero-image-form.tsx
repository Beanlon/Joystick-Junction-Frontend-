"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function HeroImageForm() {
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
    <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
      <h2
        id="hero-images-heading"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        Hero images
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Upload a file or paste an external image URL. Saving to your backend is
        not wired yet — this form is UI only for now.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="hero-alt">
            Alt text (accessibility)
          </label>
          <input
            id="hero-alt"
            name="alt"
            type="text"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            placeholder="Describe the image for screen readers"
            maxLength={200}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-800">Upload file</p>
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

        <div className="relative">
          <div
            className="absolute inset-x-0 top-1/2 border-t border-zinc-200"
            aria-hidden
          />
          <span className="relative mx-auto block w-fit bg-white px-2 text-xs text-zinc-500">
            or
          </span>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="hero-url">
            Image URL
          </label>
          <input
            id="hero-url"
            name="url"
            type="url"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Add hero image
        </button>
      </form>

      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Backend upload/save is disabled. When your API is ready, POST the file
        or URL from this form to persist <code className="font-mono">image_url</code>{" "}
        (and alt, order, active) on the server.
      </p>
    </div>
  );
}
