"use client";

import { useCallback, useState } from "react";
import type { HeroImageRow } from "@/app/admin/hero-image-actions";
import { setHeroImageActive } from "@/app/admin/hero-image-actions";

const thClass =
  "border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600";
const tdClass = "border-b border-zinc-100 px-3 py-2 align-middle text-sm text-zinc-800";

type HeroImagesTableProps = {
  items: HeroImageRow[];
  onLocalToggle: (id: string, active: boolean) => void;
  onServerConfirmed: (item: HeroImageRow) => void;
};

export function HeroImagesTable({
  items,
  onLocalToggle,
  onServerConfirmed,
}: HeroImagesTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const onToggle = useCallback(
    async (id: string, currentActive: boolean, nextActive: boolean) => {
      setToggleError(null);
      setPendingId(id);

      onLocalToggle(id, nextActive);

      const r = await setHeroImageActive(id, nextActive);
      setPendingId(null);

      if (!r.ok) {
        onLocalToggle(id, currentActive);
        setToggleError(r.error);
        return;
      }

      onServerConfirmed(r.item);
    },
    [onLocalToggle, onServerConfirmed],
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
        All hero images
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Toggle active images to control which slides appear on the storefront (when
        the homepage reads from this API).
      </p>

      {toggleError ? (
        <p
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {toggleError}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              <th className={thClass}>Preview</th>
              <th className={thClass}>Image URL</th>
              <th className={thClass}>Link URL</th>
              <th className={thClass}>Alt</th>
              <th className={thClass}>Added at</th>
              <th className={thClass}>Active</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-sm text-zinc-500"
                >
                  No hero images yet. Add one above using file upload rows.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-zinc-50/80">
                  <td className={tdClass}>
                    <img
                      src={row.imageUrl}
                      alt={row.alt ?? ""}
                      className="h-14 w-24 rounded border border-zinc-200 object-cover"
                      loading="lazy"
                    />
                  </td>
                  <td className={`${tdClass} max-w-[200px]`}>
                    <span className="line-clamp-2 break-all" title={row.imageUrl}>
                      {row.imageUrl}
                    </span>
                  </td>
                  <td className={`${tdClass} max-w-[200px]`}>
                    {row.linkUrl ? (
                      <a
                        href={row.linkUrl}
                        className="line-clamp-2 break-all text-blue-700 underline"
                        title={row.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.linkUrl}
                      </a>
                    ) : (
                      <span className="text-zinc-500">-</span>
                    )}
                  </td>
                  <td className={`${tdClass} max-w-[140px]`}>
                    <span className="line-clamp-2 text-zinc-600" title={row.alt ?? ""}>
                      {row.alt ?? "—"}
                    </span>
                  </td>
                  <td className={tdClass}>
                    {new Date(row.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className={tdClass}>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <span className="sr-only">
                        {row.active ? "Active" : "Inactive"}, toggle visibility
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={row.active}
                        disabled={pendingId === row.id}
                        onChange={(e) => {
                          void onToggle(row.id, row.active, e.target.checked);
                        }}
                      />
                      <span
                        className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform focus-within:ring-2 focus-within:ring-zinc-400 ${
                          row.active
                            ? "bg-emerald-500 after:translate-x-5"
                            : "bg-zinc-300"
                        } ${pendingId === row.id ? "opacity-50" : ""}`}
                        aria-hidden
                      />
                      <span className="text-xs font-medium text-zinc-600">
                        {row.active ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
