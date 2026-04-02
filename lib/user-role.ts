/** Normalize API / JWT role strings (handles casing quirks). */
export function normalizeUserRole(role: unknown): "USER" | "ADMIN" | null {
  if (typeof role !== "string") return null;
  const u = role.trim().toUpperCase();
  if (u === "ADMIN" || u === "USER") return u;
  return null;
}

export function isAdminRole(role: unknown): boolean {
  return normalizeUserRole(role) === "ADMIN";
}
