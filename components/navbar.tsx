import { ByteRushWordmark } from "@/components/byte-rush-wordmark";
import Link from "next/link";

const navItems = [
  {label: "Components", href: "/components",},
  {label: "Peripherals", href: "/peripherals",},
  {label: "Laptops", href: "/laptops",},


  {label: "Accessories", href: "/accessories",},
  {label: "Brands", href: "/brands",},
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1450px] flex-col gap-3 px-4 pt-7 pb-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex h-10 w-[198px] shrink-0 items-center sm:h-12 sm:w-[238px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          >
            <ByteRushWordmark className="byterush-wordmark block h-full w-full max-w-none" />
          </Link>
          <div className="flex min-w-0 flex-1 justify-center px-2">
            <div
              className="flex w-full max-w-2xl min-w-0 items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2.5 shadow-sm transition-colors focus-within:border-zinc-400 focus-within:shadow-md sm:min-w-[320px] lg:max-w-3xl"
              role="search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 shrink-0 text-zinc-600"
                aria-hidden={true}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="Search"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-500"
                aria-label="Search"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-zinc-50 px-3 py-2">
              <Link
                href="/cart"
                className="text-md font-medium text-gray-900 transition-colors hover:text-gray-400"
              >
                Cart
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 shrink-0 text-zinc-600"
                aria-hidden={true}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="text-sm font-medium text-zinc-900">0</span>
            </div>
            <Link
              href="/login"
              className="rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Log in
            </Link>
          </div>
        </div>

        <nav className="flex items-center pt-4" aria-label="Main">
          <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-md font-medium text-zinc-900 transition-colors hover:text-zinc-950"
                >
                  {item.label}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden={true}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
