"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "@/lib/auth-session";

export async function adminLogout() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  jar.delete("admin_session");
  redirect("/");
}
