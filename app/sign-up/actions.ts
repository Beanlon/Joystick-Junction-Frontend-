"use server";

import { redirect } from "next/navigation";
import { getBackendUrl } from "@/lib/backend-url";

export type SignUpState = {
  error?: string;
};

export async function signUpAction(
  _prev: SignUpState | undefined,
  formData: FormData,
): Promise<SignUpState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!firstName || !lastName) {
    return { error: "Enter your first and last name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const backend = getBackendUrl();
  if (!backend) {
    return {
      error:
        "Registration is misconfigured. Set BACKEND_URL in .env.local (e.g. http://localhost:4000).",
    };
  }

  const displayName = `${firstName} ${lastName}`.trim();

  let res: Response;
  try {
    res = await fetch(`${backend}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
  } catch {
    return { error: "Could not reach the server. Is the API running?" };
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string };

  if (res.status === 409) {
    return { error: data.error ?? "That email is already registered." };
  }
  if (!res.ok) {
    return { error: data.error ?? "Registration failed." };
  }

  redirect("/login");
}
