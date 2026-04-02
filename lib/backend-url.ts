/**
 * Resolves the Express API origin for Server Actions.
 * Order: BACKEND_URL → NEXT_PUBLIC_BACKEND_URL → dev default http://localhost:4000
 */
export function getBackendUrl(): string | null {
  const fromEnv =
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  let base = fromEnv?.replace(/\/$/, "") ?? "";
  if (!base && process.env.NODE_ENV === "development") {
    base = "http://localhost:4000";
  }
  return base || null;
}
