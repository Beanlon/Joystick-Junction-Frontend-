import { getBackendUrl } from "@/lib/backend-url";
import { HeroImageCarousel } from "./hero-image-carousel";


type HeroImageRow = {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  alt: string | null;
  active: boolean;
};

async function getHeroImages(): Promise<HeroImageRow[]> {
  const backend = getBackendUrl();
  if (!backend) return [];

  const res = await fetch(`${backend}/hero-images`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];
  const rows = (await res.json()) as HeroImageRow[];
  return rows.filter((r) => r.active);
}

export async function LandingHeroSection() {
  const images = await getHeroImages();

  return (
    <section
      className="relative min-h-[40vh] rounded-2xl max-w-full overflow-hidden py-6 sm:py-10 lg:min-h-[60vh] lg:py-14"
      aria-label="Hero section"
    >
      <div className="absolute inset-0" />
      <HeroImageCarousel images={images} />

      <div className="relative z-10 max-w-3xl">
      </div>
    </section>
  );
}