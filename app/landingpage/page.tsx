import { LandingHeroSection } from "@/components/landing-hero-section";

export default function LandingPage() {
  return (
    <div
      className="flex flex-1 flex-col bg-background font-sans text-gray-600"
      aria-label="Page wireframe preview"
    >
      <div className="mx-auto flex w-full max-w-[1450px] flex-1 flex-col gap-8 px-4 py-8 text-gray-600 sm:px-6 sm:py-10">
        <LandingHeroSection />

        {/* Content grid wireframe */}
        <section className="border-2 border-dashed border-gray-500 p-6">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-dashed border-gray-300 pb-4">
            <div className="space-y-2">
              <div className="h-3 w-40 rounded-sm bg-gray-300" />
              <div className="h-2.5 w-56 rounded-sm bg-gray-300" />
            </div>
            <div className="hidden h-9 w-28 rounded-md border border-dashed border-gray-300 sm:block" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="flex flex-col gap-4 rounded-lg border border-dashed border-gray-300 p-4"
              >
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-300/40">
                  <div className="h-16 w-24 rounded border border-dashed border-gray-400 bg-gray-400/50" />
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-2/3 rounded-sm bg-gray-300" />
                  <div className="h-2 w-full rounded-sm bg-gray-300" />
                  <div className="h-2 w-4/5 rounded-sm bg-gray-300" />
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="h-3 w-16 rounded-sm bg-gray-300" />
                  <div className="h-8 w-20 rounded-md border border-dashed border-gray-300" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer wireframe */}
        <footer className="mt-auto flex flex-col gap-4 border-2 border-dashed border-gray-500 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <div className="h-2 w-20 rounded-sm bg-gray-300" />
            <div className="h-2 w-14 rounded-sm bg-gray-300" />
          </div>
          <div className="flex flex-wrap gap-3">
            {[44, 52, 36].map((w, i) => (
              <div
                key={i}
                className="h-2 rounded-sm bg-gray-300"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
