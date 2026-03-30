"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";

const COOKIE = "admin_session";

export async function adminLogout() {
  const jar = await cookies();
  jar.delete(COOKIE);
  redirect("/login?next=/admin");
}
