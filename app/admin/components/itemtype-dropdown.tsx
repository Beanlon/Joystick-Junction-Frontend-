"use client";

import { useEffect, useId, useRef, useState } from "react";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600";

export type ItemTypeOption = {
  id: string;
  slug: string;
  name: string;
};

export type ItemTypeDropdownProps = {
  id: string;
  name?: string;
  label?: string;
  placeholder?: string;
  itemTypes?: ItemTypeOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (itemTypeId: string) => void;
  loading?: boolean;
  onCreateType?: (
    name: string,
  ) => Promise<{ ok: true; item: ItemTypeOption } | { ok: false; error: string }>;
  onDeleteType?: (itemTypeId: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  canManageTypes?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function ItemTypeDropdown({
  id,
  name = "itemTypeId",
  label = "Item type",
  placeholder = "Select item type",
  itemTypes = [],
  value: valueProp,
  defaultValue = "",
  onValueChange,
  loading = false,
  onCreateType,
  onDeleteType,
  canManageTypes = false,
  disabled,
  required,
  className = "",
}: ItemTypeDropdownProps) {
  const options = itemTypes;
  const controlled = valueProp !== undefined;
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const [newTypeName, setNewTypeName] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const selectedId = controlled ? (valueProp ?? "") : internal;

  const selected = options.find((t) => t.id === selectedId);
  const display = loading
    ? "Loading item types..."
    : options.length === 0
      ? "No types for this category yet"
      : (selected?.name ?? placeholder);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function pick(next: string) {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
    setOpen(false);
  }

  async function handleCreateType() {
    if (!onCreateType) return;
    const nextName = newTypeName.trim();
    if (!nextName) {
      setActionError("Type name is required.");
      return;
    }

    setActionError(null);
    setIsCreating(true);
    const r = await onCreateType(nextName);
    setIsCreating(false);

    if (!r.ok) {
      setActionError(r.error);
      return;
    }

    setNewTypeName("");
    pick(r.item.id);
  }

  async function handleDeleteType(id: string) {
    if (!onDeleteType) return;
    setActionError(null);
    setDeletingId(id);
    const r = await onDeleteType(id);
    setDeletingId(null);
    if (!r.ok) {
      setActionError(r.error);
      return;
    }
    if (selectedId === id) {
      onValueChange?.("");
      if (!controlled) setInternal("");
    }
  }

  const isDisabled = loading || Boolean(disabled);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>

      <input type="hidden" name={name} value={selectedId} />

      <button
        id={id}
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-sm text-zinc-900 shadow-sm outline-none ring-zinc-500 hover:border-zinc-400 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => !isDisabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span className={selected ? "text-zinc-900" : "text-zinc-500"}>{display}</span>
        <span className="text-zinc-400" aria-hidden>
          ▾
        </span>
      </button>

      {loading ? (
        <span className="sr-only" aria-live="polite">
          Loading item types
        </span>
      ) : null}

      {open && !isDisabled && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selectedId === ""}
              className="w-full px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-50"
              onClick={() => pick("")}
            >
              {placeholder}
            </button>
          </li>
          {options.length === 0 ? (
            <li role="presentation">
              <p className="px-3 py-2 text-sm text-zinc-500">No types for this category yet.</p>
            </li>
          ) : null}
          {options.map((t) => (
            <li key={t.id} role="presentation">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedId === t.id}
                  className={`flex-1 px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                    selectedId === t.id ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-800"
                  }`}
                  onClick={() => pick(t.id)}
                >
                  {t.name}
                </button>
                {onDeleteType ? (
                  <button
                    type="button"
                    className="mr-1 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-red-700 disabled:opacity-50"
                    aria-label={`Delete ${t.name}`}
                    disabled={deletingId === t.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void handleDeleteType(t.id);
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l1 12a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l1-12" />
                    </svg>
                  </button>
                ) : null}
              </div>
            </li>
          ))}
          {canManageTypes && !loading ? (
            <li role="presentation" className="mt-1 border-t border-zinc-200 px-2 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="New item type"
                  className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => void handleCreateType()}
                  disabled={isCreating}
                  className="shrink-0 rounded-md border border-zinc-300 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {isCreating ? "Adding..." : "Add type"}
                </button>
              </div>
            </li>
          ) : null}
        </ul>
      )}

      {actionError ? (
        <p className="mt-1 text-xs text-red-700" role="alert">
          {actionError}
        </p>
      ) : null}

      {required && !selectedId ? (
        <span className="sr-only" aria-live="polite">
          Item type is required
        </span>
      ) : null}
    </div>
  );
}