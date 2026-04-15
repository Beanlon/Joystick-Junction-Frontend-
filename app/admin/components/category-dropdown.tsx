"use client";

import { useEffect, useId, useRef, useState } from "react";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600";

export type CategoryOption = {
  id: string;
  slug: string;
  name: string;
};

export type CategoryDropdownProps = {
  id: string;
  name?: string;
  label?: string;
  placeholder?: string;
  /** From your API (`GET /categories`); the backend reads the DB using DATABASE_URL — never expose DATABASE_URL in the browser. */
  categories: CategoryOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (categoryId: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function CategoryDropdown({
  id,
  name = "categoryId",
  label = "Category",
  placeholder = "Select category",
  categories,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  disabled,
  required,
  className = "",
}: CategoryDropdownProps) {
  const options = categories;
  const controlled = valueProp !== undefined;
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const selectedId = controlled ? (valueProp ?? "") : internal;

  const selected = options.find((c) => c.id === selectedId);
  const display =
    options.length === 0 ? "No categories available" : (selected?.name ?? placeholder);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function pick(id: string) {
    if (!controlled) setInternal(id);
    onValueChange?.(id);
    setOpen(false);
  }

  const isDisabled = disabled || options.length === 0;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>

      {/* Form submit value */}
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
          {options.map((c) => (
            <li key={c.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selectedId === c.id}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                  selectedId === c.id ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-800"
                }`}
                onClick={() => pick(c.id)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Browser hint for required — hidden field can be empty; validate on submit or use JS */}
      {required && !selectedId ? (
        <span className="sr-only" aria-live="polite">
          Category is required
        </span>
      ) : null}
    </div>
  );
}