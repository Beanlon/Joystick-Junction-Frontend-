import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwt-secret";
import { normalizeUserRole } from "@/lib/user-role";

export const AUTH_COOKIE = "auth_token";

export type AuthPayload = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
};

export async function verifyAuthCookie(
  token: string | undefined,
): Promise<AuthPayload | null> {
  const secret = getJwtSecret();
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] },
    );
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = normalizeUserRole(payload.role);
    if (!sub || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}

export async function requireAdminCookie(
  token: string | undefined,
): Promise<boolean> {
  const p = await verifyAuthCookie(token);
  return p?.role === "ADMIN";
}