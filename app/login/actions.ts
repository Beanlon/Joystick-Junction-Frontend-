"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminSessionToken } from "@/lib/admin-auth";

const ADMIN_SESSION_COOKIE = "admin_session";

export type LoginFormState = {
  error?: string;
  notice?: string;
};

function safeInternalPath(raw: string, fallback: string): string {
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

function isAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET) {
    return false;
  }
  return (
    email.trim().toLowerCase() === adminEmail &&
    password === process.env.ADMIN_PASSWORD
  );
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

  if (isAdminCredentials(email, password)) {
    try {
      const token = createAdminSessionToken();
      const jar = await cookies();
      jar.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
      });
    } catch {
      return {
        error:
          "Admin login is misconfigured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SECRET in .env.local.",
      };
    }
    let destination = safeInternalPath(nextRaw, "/admin");
    if (destination === "/" || destination === "/login") {
      destination = "/admin";
    }
    redirect(destination);
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  return {
    notice:
      "Sign-in isn’t connected to a backend yet. Wire this form to NextAuth, Clerk, or your API in app/login/actions.ts.",
  };
}
