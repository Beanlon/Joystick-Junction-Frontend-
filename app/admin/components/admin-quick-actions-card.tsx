import Link from "next/link";

export type AdminQuickAction = {
  label: string;
  description: string;
  href: string;
  icon: "hero" | "add-product" | "manage-products" | "brand";
};

const ADMIN_QUICK_ACTIONS: AdminQuickAction[] = [
  {
    label: "Insert Hero Images",
    description: "Carousel Slide Management",
    href: "/admin",
    icon: "hero",
  },
  {
    label: "Add/Edit Products",
    description: "Create a new listing",
    href: "/admin?panel=add-product",
    icon: "add-product",
  },
  {
    label: "Edit/Manage Prioducts",
    description: "Modify existing products",
    href: "/admin?panel=manage-products",
    icon: "manage-products",
  },
  {
    label: "Add Brands",
    description: "Register a new brand",
    href: "/admin?panel=brand-form",
    icon: "brand",
  },
];

function SvgHero({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function SvgAddProduct({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function SvgManageProducts({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.008v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.008v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function SvgBrand({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h.008v.008H6V6Z"
      />
    </svg>
  );
}

const QUICK_ACTION_SVGS: Record<
  AdminQuickAction["icon"],
  React.ComponentType<{ className?: string }>
> = {
  hero: SvgHero,
  "add-product": SvgAddProduct,
  "manage-products": SvgManageProducts,
  brand: SvgBrand,
};

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

export function AdminQuickActionsCard() {
  return (
    <div 
    className="sticky top-[calc(var(--site-header-sticky-offset)+0.5rem)] z-40 col-span-1 h-fit self-start rounded-xl border border-zinc-200 bg-background shadow-sm">
      <div className="border-b border-zinc-200 p-4">
        <p className="text-lg font-semibold tracking-tight">Quick Actions</p>
      </div>
      <div className="flex flex-col gap-2 h-full">
        {ADMIN_QUICK_ACTIONS.map((action) => {
          const Icon = QUICK_ACTION_SVGS[action.icon];
          return (
            <Link href={action.href} key={action.label}>
              <div className="flex w-full items-start gap-3 px-6 py-3 text-left sm:px-4">
                <span className="mt-0.5 shrink-0 rounded-md bg-zinc-100 p-2 text-zinc-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-md font-semibold text-zinc-900">
                    {action.label}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {action.description}
                  </div>
                </div>
                <span className="mt-0.5 shrink-0 rounded-md p-2 text-zinc-600">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
              <div className="w-full border-t border-zinc-200" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
