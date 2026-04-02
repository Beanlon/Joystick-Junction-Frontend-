import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, verifyAuthCookie } from "@/lib/auth-session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const payload = await verifyAuthCookie(jar.get(AUTH_COOKIE)?.value);
  if (!payload) {
    redirect("/login?reason=session");
  }
  if (payload.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-[1450px] px-4 py-4 text-zinc-900 sm:px-6">
      {children}
    </div>
  );
}
