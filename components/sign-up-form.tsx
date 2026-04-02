"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type SignUpState } from "@/app/sign-up/actions";

function Field({
  id,
  label,
  name,
  type,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    {} as SignUpState,
  );

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-lg shadow-zinc-200/50 sm:p-10">
      <div className="text-center">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900"
        >
          Byte<span className="text-emerald-600">Rush</span>
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add your name, email, and a password. You’ll be redirected to sign in
          when registration succeeds.
        </p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="signup-first-name"
            label="First name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Alex"
          />
          <Field
            id="signup-last-name"
            label="Last name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Rivera"
          />
        </div>
        <Field
          id="signup-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-zinc-700"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
          />
          <p className="mt-1 text-xs text-zinc-500">At least 8 characters.</p>
        </div>

        {state?.error ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
