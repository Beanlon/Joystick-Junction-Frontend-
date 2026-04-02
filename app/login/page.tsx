import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in | ByteRush",
  description: "Sign in to your ByteRush account",
};

type Props = {
  searchParams: Promise<{ next?: string; reason?: string }>;
};

export default async function LoginPage(props: Props) {
  const { next, reason } = await props.searchParams;
  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const sessionInvalid = reason === "session";

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 py-12 sm:px-6 sm:py-16">
      <LoginForm nextPath={nextPath} sessionInvalid={sessionInvalid} />
    </div>
  );
}
