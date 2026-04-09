"use client";

import { useCallback, useEffect, useState } from "react";
import { listHeroImages, type HeroImageRow } from "@/app/admin/hero-image-actions";
import { HeroImageForm } from "@/app/admin/components/hero-image-form";
import { HeroImagesTable } from "@/app/admin/components/hero-images-table";

export function HeroImagesPanel() {
  const [items, setItems] = useState<HeroImageRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const r = await listHeroImages();
    if (r.ok) {
      setItems(r.items);
    } else {
      setLoadError(r.error);
    }
  }, []);

  const setActiveLocal = (id: string, active: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active } : item)),
    );
  };

  const mergeRow = (item: HeroImageRow) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, ...item } : i)),
    );
  };

  const addNewItem = useCallback((item: HeroImageRow) => {
    setItems((prev) => [...prev, item]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      {loadError ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {loadError}
        </p>
      ) : null}
      <HeroImageForm onCreated={load} />
      <HeroImagesTable
        items={items}
        onLocalToggle={setActiveLocal}
        onServerConfirmed={mergeRow}
      />
    </div>
  );
}
