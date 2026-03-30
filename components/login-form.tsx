"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/app/login/actions";

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

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    {} as LoginFormState,
  );

  const headingAdmin = nextPath.startsWith("/admin");

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
          {headingAdmin ? "Admin sign in" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {headingAdmin
            ? "Use your admin email and password from .env.local."
            : "Sign in to track orders and save your cart."}
        </p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <input type="hidden" name="next" value={nextPath} />
        <Field
          id="login-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
          />
          <p className="mt-1 text-xs text-zinc-500">
            {headingAdmin
              ? "Same password as ADMIN_PASSWORD in .env.local."
              : "At least 8 characters for store accounts."}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/30"
          />
          Remember me on this device
        </label>

        {state?.error ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
        {state?.notice ? (
          <p
            className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900"
            role="status"
          >
            {state.notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Don’t have an account?{" "}
        <Link
          href="/browse"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Browse the store
        </Link>
      </p>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-white px-3 text-zinc-400">Or</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-medium text-zinc-400"
        >
          Continue with Google
        </button>
        <p className="text-center text-xs text-zinc-400">
          Social login coming soon
        </p>
      </div>
    </div>
  );
}
