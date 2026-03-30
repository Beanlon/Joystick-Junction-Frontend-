import { redirect } from "next/navigation";

/** Admin login uses the same UI as customers: `/login?next=/admin` */
export default function AdminLoginRedirectPage() {
  redirect("/login?next=/admin");
}
