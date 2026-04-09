"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createHeroImage } from "@/app/admin/hero-image-actions";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

type HeroImageFormProps = {
  onCreated?: () => void;
};

type UploadRow = {
  id: string;
  file: File | null;
  previewUrl: string | null;
  alt: string;
  linkUrl: string;
};

function createEmptyRow(id: string): UploadRow {
  return {
    id,
    file: null,
    previewUrl: null,
    alt: "",
    linkUrl: "",
  };
}

export function HeroImageForm({ onCreated }: HeroImageFormProps) {
  const [rows, setRows] = useState<UploadRow[]>([createEmptyRow("row-0")]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const rowCounterRef = useRef(1);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setInputRef = useCallback((id: string, node: HTMLInputElement | null) => {
    inputRefs.current[id] = node;
  }, []);

  const updateRow = useCallback((id: string, patch: Partial<UploadRow>) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        return { ...row, ...patch };
      }),
    );
  }, []);

  const onFileChange = useCallback(
    (id: string, file: File | null) => {
      if (file && !file.type.startsWith("image/")) {
        setSubmitError("Only image files are allowed.");
        return;
      }
      setSubmitError(null);
      setRows((current) =>
        current.map((row) => {
          if (row.id !== id) return row;
          if (row.previewUrl) {
            URL.revokeObjectURL(row.previewUrl);
          }
          return {
            ...row,
            file,
            previewUrl: file ? URL.createObjectURL(file) : null,
          };
        }),
      );
    },
    [],
  );

  const addRow = useCallback(() => {
    const nextId = `row-${rowCounterRef.current}`;
    rowCounterRef.current += 1;
    setRows((current) => [...current, createEmptyRow(nextId)]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((current) => {
      if (current.length === 1) {
        const only = current[0];
        if (only.id !== id) return current;
        if (only.previewUrl) {
          URL.revokeObjectURL(only.previewUrl);
        }
        return [createEmptyRow("row-0")];
      }
      const rowToRemove = current.find((row) => row.id === id);
      if (rowToRemove?.previewUrl) {
        URL.revokeObjectURL(rowToRemove.previewUrl);
      }
      return current.filter((row) => row.id !== id);
    });
  }, []);

  useEffect(() => {
    return () => {
      rows.forEach((row) => {
        if (row.previewUrl) {
          URL.revokeObjectURL(row.previewUrl);
        }
      });
    };
  }, [rows]);

  return (
    <div className="rounded-xl border border-zinc-200 p-4 sm:p-6">
      <h2
        id="hero-images-heading"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        Hero images
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Add hero image rows. Each row can include a file upload, click-through URL, and alt text.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitError(null);
          setSubmitting(true);

          const readyRows = rows.filter((row) => row.file);
          if (readyRows.length === 0) {
            setSubmitError("Please upload at least one image file.");
            setSubmitting(false);
            return;
          }

          const results = await Promise.all(
            readyRows.map((row) =>
              createHeroImage({
                file: row.file as File,
                alt: row.alt,
                linkUrl: row.linkUrl,
              }),
            ),
          );
          setSubmitting(false);
          const firstError = results.find((result) => !result.ok);
          if (!firstError) {
            rows.forEach((row) => {
              if (row.previewUrl) {
                URL.revokeObjectURL(row.previewUrl);
              }
            });
            rowCounterRef.current = 1;
            setRows([createEmptyRow("row-0")]);
            onCreated?.();
          } else {
            setSubmitError(firstError.error);
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

        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-800">Upload rows</p>
          <div className="space-y-3">
            {rows.map((row, index) => {
              const fileInputId = `hero-file-${row.id}`;
              return (
                <div
                  key={row.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900">Row {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      Delete row
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        className="text-sm font-medium text-zinc-800"
                        htmlFor={fileInputId}
                      >
                        Upload photo
                      </label>
                      <input
                        ref={(node) => setInputRef(row.id, node)}
                        id={fileInputId}
                        name={`image-${row.id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => onFileChange(row.id, e.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                      <div className="mt-1.5 flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            inputRefs.current[row.id]?.click();
                          }}
                          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                        >
                          Choose image
                        </button>

                      <span
                        className={`min-w-0 flex-1 truncate rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-normal ${
                          row.file ? "text-zinc-800" : "text-zinc-400"
                        }`}
                        title={row.file ? row.file.name : "No file selected"}
                      >
                        {row.file ? row.file.name : "No file selected"}
                      </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-800" htmlFor={`hero-link-${row.id}`}>
                        Image URL (click-through link)
                      </label>
                      <input
                        id={`hero-link-${row.id}`}
                        name={`linkUrl-${row.id}`}
                        type="url"
                        value={row.linkUrl}
                        onChange={(e) => updateRow(row.id, { linkUrl: e.target.value })}
                        className={fieldClass}
                        placeholder="https://example.com/deal"
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium text-zinc-800" htmlFor={`hero-alt-${row.id}`}>
                      Alt text
                    </label>
                    <input
                      id={`hero-alt-${row.id}`}
                      name={`alt-${row.id}`}
                      type="text"
                      value={row.alt}
                      onChange={(e) => updateRow(row.id, { alt: e.target.value })}
                      className={fieldClass}
                      placeholder="Describe the image for screen readers"
                      maxLength={200}
                    />
                  </div>

                  {row.previewUrl ? (
                    <figure className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                      <img
                        src={row.previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />
                      <figcaption className="px-3 py-2 text-xs text-zinc-500">
                        Preview
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={addRow}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Add row
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Create hero images"}
        </button>
      </form>
    </div>
  );
}
