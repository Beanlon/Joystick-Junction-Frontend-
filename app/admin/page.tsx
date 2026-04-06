import { AdminMetricsGrid } from "@/app/admin/components/admin-metric-card";
import { AdminQuickActionsCard } from "@/app/admin/components/admin-quick-actions-card";
import { HeroImagesPanel } from "@/app/admin/components/hero-images-panel";
import { AddProductForm } from "./components/add-product-form";
import { ManageProductsForm } from "./components/manage-products-form";
import { BrandForm } from "./components/brand-form";
type AdminPageProps = {
  searchParams: Promise<{ panel?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { panel } = await searchParams;
  const view =
    panel === "add-product"
      ? "add-product"
      : panel === "manage-products"
        ? "manage-products"
        : panel === "brand-form"
          ? "brand-form"
          : "hero";

  return (
    <>
      <div className="py-5">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-700">
          Manage your store content, products, and brands
        </p>
      </div>
      <AdminMetricsGrid />
      <div className="mt-8 grid grid-cols-3 gap-4">
        <AdminQuickActionsCard />
        <div className="col-span-2 min-w-0">
          {view === "add-product" ? (
            <AddProductForm />
          ) : view === "manage-products" ? (
            <ManageProductsForm />
          ) : view === "brand-form" ? (
            <BrandForm />
          ) : (
            <HeroImagesPanel />
          )}
        </div>
      </div>
    </>
  );
}
