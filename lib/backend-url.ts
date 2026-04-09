/**
 * Resolves the Express API origin for Server Actions.
 * Order: BACKEND_URL → NEXT_PUBLIC_BACKEND_URL
 */
export function getBackendUrl(): string | null {
  const fromEnv =
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  const base = fromEnv?.replace(/\/$/, "") ?? "";
  return base || null;
}
