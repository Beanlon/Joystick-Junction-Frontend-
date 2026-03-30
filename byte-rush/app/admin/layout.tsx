import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";

const COOKIE = "admin_session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  if (!verifyAdminSession(jar.get(COOKIE)?.value)) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="mx-auto w-full max-w-[1450px] px-4 py-4 text-zinc-900 sm:px-6">
      {children}
    </div>
  );
}