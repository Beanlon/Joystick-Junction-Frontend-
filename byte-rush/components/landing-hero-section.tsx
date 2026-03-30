export function LandingHeroSection() {
  return (
    <section
      className="grid gap-8 rounded-2xl border-2 border-dashed border-gray-500 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"
      aria-label="Hero wireframe"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <div className="h-8 w-4/5 max-w-md rounded-sm bg-gray-300 sm:h-10" />
          <div className="space-y-2">
            <div className="h-2.5 w-full max-w-xl rounded-sm bg-gray-300" />
            <div className="h-2.5 w-full max-w-lg rounded-sm bg-gray-300" />
            <div className="h-2.5 w-3/4 max-w-md rounded-sm bg-gray-300" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-11 w-32 rounded-full border border-dashed border-gray-400 bg-gray-300/40" />
          <div className="h-11 w-36 rounded-full border border-dashed border-gray-400 bg-gray-300/30" />
        </div>
        <div>
          <div className="mb-3 h-2.5 w-24 rounded-sm bg-gray-300" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-lg border border-dashed border-gray-300 p-3"
              >
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-300/40">
                  <div className="h-12 w-20 rounded border border-dashed border-gray-400 bg-gray-400/50" />
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-2/3 rounded-sm bg-gray-300" />
                  <div className="h-2 w-1/2 rounded-sm bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-300/40 lg:min-h-[320px]">
        <div className="h-24 w-40 rounded-lg border border-dashed border-gray-400 bg-gray-400/50" />
      </div>
    </section>
  );
}
