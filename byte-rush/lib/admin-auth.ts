import { createHmac, timingSafeEqual } from "crypto";

export function createAdminSessionToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not set");
  }
  return createHmac("sha256", secret)
    .update("byte-rush-admin-session")
    .digest("hex");
}

export function verifyAdminSession(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_SECRET) {
    return false;
  }
  try {
    const expected = createAdminSessionToken();
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.length);
}
