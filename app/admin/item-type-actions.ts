"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend-url";
import { AUTH_COOKIE } from "@/lib/auth-session";

export type ItemTypeActionRow = {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  sortOrder: number;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function bearerHeaders(): Promise<Record<string, string>> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function createItemType(input: {
  categoryId: string;
  name: string;
}): Promise<{ ok: true; item: ItemTypeActionRow } | { ok: false; error: string }> {
  const backend = getBackendUrl();
  if (!backend) {
    return { ok: false, error: "BACKEND_URL is not configured." };
  }

  const categoryId = input.categoryId.trim();
  const name = input.name.trim();
  const slug = slugify(name);

  if (!categoryId) {
    return { ok: false, error: "Select a category first." };
  }
  if (!name) {
    return { ok: false, error: "Item type name is required." };
  }
  if (!slug) {
    return { ok: false, error: "Could not generate a valid slug from this item type name." };
  }

  try {
    const headers = await bearerHeaders();
    const res = await fetch(`${backend}/item-types`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name, slug }),
      cache: "no-store",
    });

    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      id?: string;
      categoryId?: string;
      slug?: string;
      name?: string;
      sortOrder?: number;
    };

    if (!res.ok) {
      return { ok: false, error: body.error ?? "Failed to create item type." };
    }

    if (
      typeof body.id !== "string" ||
      typeof body.categoryId !== "string" ||
      typeof body.slug !== "string" ||
      typeof body.name !== "string"
    ) {
      return { ok: false, error: "Invalid create item type response." };
    }

    return {
      ok: true,
      item: {
        id: body.id,
        categoryId: body.categoryId,
        slug: body.slug,
        name: body.name,
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
      },
    };
  } catch {
    return { ok: false, error: "Could not reach the API." };
  }
}

export async function deleteItemType(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const backend = getBackendUrl();
  if (!backend) {
    return { ok: false, error: "BACKEND_URL is not configured." };
  }

  const itemTypeId = id.trim();
  if (!itemTypeId) {
    return { ok: false, error: "Invalid item type id." };
  }

  try {
    const headers = await bearerHeaders();
    const res = await fetch(`${backend}/item-types/${encodeURIComponent(itemTypeId)}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (res.status === 204) {
      return { ok: true };
    }

    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: body.error ?? "Failed to delete item type." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the API." };
  }
}
