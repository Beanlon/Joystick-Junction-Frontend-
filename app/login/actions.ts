"use server";

import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBackendUrl } from "@/lib/backend-url";
import { AUTH_COOKIE } from "@/lib/auth-session";
import { isAdminRole } from "@/lib/user-role";

export type LoginFormState = {
  error?: string;
  notice?: string;
};

type LoginApiUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: "USER" | "ADMIN";
};

function safeInternalPath(raw: string, fallback: string): string {
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

export async function loginAction(
  _prev: LoginFormState | undefined,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "");

  if (!email) {
    return { error: "Enter your email address." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!password) {
    return { error: "Enter your password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const backend = getBackendUrl();
  if (!backend) {
    return {
      error:
        "Sign-in is misconfigured. Set BACKEND_URL in .env.local (e.g. http://localhost:4000).",
    };
  }

  let res: Response;
  try {
    res = await fetch(`${backend}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { error: "Could not reach the server. Is the API running?" };
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    user?: LoginApiUser;
    token?: string;
  };

  if (!res.ok) {
    return { error: data.error ?? "Sign-in failed." };
  }
  if (!data.token || !data.user) {
    return { error: "Invalid response from server." };
  }

  const jar = await cookies();
  jar.set(AUTH_COOKIE, data.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  jar.delete("admin_session");

  let fromJwt: unknown;
  try {
    fromJwt = decodeJwt(data.token).role;
  } catch {
    fromJwt = undefined;
  }

  if (isAdminRole(data.user.role) || isAdminRole(fromJwt)) {
    redirect("/admin");
  }

  let destination = safeInternalPath(nextRaw, "/");
  if (destination === "/login" || destination.startsWith("/admin")) {
    destination = "/";
  }
  redirect(destination);
}
