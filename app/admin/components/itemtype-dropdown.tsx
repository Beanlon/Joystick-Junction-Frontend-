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
  const selectedId = controlled ? (valueProp ?? "") : internal;

  const selected = options.find((t) => t.id === selectedId);
  const display =
    options.length === 0
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

  const isDisabled = disabled || options.length === 0;

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
          {options.map((t) => (
            <li key={t.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selectedId === t.id}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                  selectedId === t.id ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-800"
                }`}
                onClick={() => pick(t.id)}
              >
                {t.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {required && !selectedId ? (
        <span className="sr-only" aria-live="polite">
          Item type is required
        </span>
      ) : null}
    </div>
  );
}