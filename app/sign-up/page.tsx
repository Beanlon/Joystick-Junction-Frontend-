import type { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = {
  title: "Create account | ByteRush",
  description: "Create your ByteRush account",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 py-12 sm:px-6 sm:py-16">
      <SignUpForm />
    </div>
  );
}
