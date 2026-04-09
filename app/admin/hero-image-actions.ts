"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend-url";
import { AUTH_COOKIE } from "@/lib/auth-session";

export type HeroImageRow = {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  alt: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

async function bearerHeaders(): Promise<Record<string, string>> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const h: Record<string, string> = {};
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function listHeroImages(): Promise<
  { ok: true; items: HeroImageRow[] } | { ok: false; error: string }
> {
  const backend = getBackendUrl();
  if (!backend) {
    return { ok: false, error: "BACKEND_URL is not configured." };
  }
  try {
    const headers = await bearerHeaders();
    const res = await fetch(`${backend}/hero-images`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: body.error ?? "Failed to load hero images." };
    }
    const items = (await res.json()) as HeroImageRow[];
    return { ok: true, items };
  } catch {
    return { ok: false, error: "Could not reach the API." };
  }
}

export async function createHeroImage(input: {
  file: File;
  alt?: string;
  linkUrl?: string;
}): Promise<{ ok: true; item: HeroImageRow } | { ok: false; error: string }> {
  const backend = getBackendUrl();
  if (!backend) {
    return { ok: false, error: "BACKEND_URL is not configured." };
  }
  if (!input.file || !input.file.type.startsWith("image/")) {
    return { ok: false, error: "A valid image file is required." };
  }
  try {
    const headers = await bearerHeaders();
    const form = new FormData();
    form.set("image", input.file);
    form.set("alt", (input.alt ?? "").trim());
    form.set("linkUrl", (input.linkUrl ?? "").trim());
    const res = await fetch(`${backend}/hero-images`, {
      method: "POST",
      headers,
      body: form,
    });
    
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: body.error ?? "Failed to create hero image." };
    }
    
    return { ok: true, item: body as HeroImageRow };
  } catch {
    return { ok: false, error: "Could not reach the API." };
  }
}

export async function setHeroImageActive(
  id: string,
  active: boolean,
): Promise<{ ok: true; item: HeroImageRow } | { ok: false; error: string }> {
  const backend = getBackendUrl();
  if (!backend) {
    return { ok: false, error: "BACKEND_URL is not configured." };
  }
  if (!id) {
    return { ok: false, error: "Invalid id." };
  }
  try {
    const headers = await bearerHeaders();
    const res = await fetch(`${backend}/hero-images/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!res.ok) {
      return { ok: false, error: body.error ?? "Failed to update hero image." };
    }
    return { ok: true, item: body as HeroImageRow };
  } catch {
    return { ok: false, error: "Could not reach the API." };
  }
}
