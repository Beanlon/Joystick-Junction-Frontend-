"use client";

import { useEffect, useMemo, useState } from "react";

type HeroImageRow = {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  alt: string | null;
  active: boolean;
};

type HeroImageCarouselProps = {
  images: HeroImageRow[];
};

const SLIDE_INTERVAL_MS = 4500;

export function HeroImageCarousel({ images }: HeroImageCarouselProps) {
  const activeImages = useMemo(() => images.filter((img) => img.active), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeImages.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % activeImages.length);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeImages.length]);

  if (activeImages.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      {activeImages.map((img, index) => {
        const isActive = index === currentIndex;

        const imageNode = (
          <div className="h-full w-full overflow-hidden">
                <img
                src={img.imageUrl}
                alt={img.alt ?? "Hero image"}
            className="h-full w-full object-cover"
                loading={isActive ? "eager" : "lazy"}
                />
            </div>
        );

        return (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            {img.linkUrl ? (
              <a
                href={img.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="block h-full w-full"
              >
                {imageNode}
              </a>
            ) : (
              imageNode
            )}
          </div>
        );
      })}

      {activeImages.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
          {activeImages.map((img, index) => {
            const active = index === currentIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  active ? "bg-white" : "bg-white/55 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={active}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
