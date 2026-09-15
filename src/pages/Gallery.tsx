import { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import SiteFooter from "@/components/SiteFooter";
import { usePrints } from "@/hooks/usePrints";
import { collectTags } from "@/lib/prints";
import { errorMessage } from "@/lib/errors";

const Gallery = () => {
  const { data: prints, isLoading, error } = usePrints();
  const [selectedCategory, setSelectedCategory] = useState<string>("everything");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const published = useMemo(() => (prints ?? []).filter((print) => print.published), [prints]);
  const categories = useMemo(() => ["everything", ...collectTags(published)], [published]);

  const filteredPrints = useMemo(() => {
    if (selectedCategory === "everything") return published;
    return published.filter((print) =>
      print.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase()),
    );
  }, [published, selectedCategory]);

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <section
          ref={sectionRef}
          className="pt-32 md:pt-28 page-bottom-safe px-6 max-w-[1180px] mx-auto w-full"
        >
          <header className="mb-10">
            <p className="eyebrow mb-3">Gallery</p>
            <h1 className="text-headline">Prints, prototypes and objects</h1>
            <span className="accent-bar mt-4" />
          </header>

          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-5 h-5 animate-spin text-caption" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-destructive py-24">
              Couldn't load the gallery. {errorMessage(error)}
            </p>
          )}

          {!isLoading && !error && filteredPrints.length === 0 && (
            <p className="text-center text-sm text-caption py-24">
              No prints here yet.
            </p>
          )}

          {/* Mobile: 2-column grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {filteredPrints.map((print, index) => (
              <Link
                key={print.id}
                to={`/print/${print.slug}`}
                className={`project-card group block rounded-[3px] border border-border bg-white transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden bg-cream aspect-[4/5]">
                  <img
                    src={print.images[0]}
                    alt={print.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="50vw"
                  />
                </div>

                <div className="p-3">
                  <h2 className="font-heading font-semibold text-[13px] tracking-heading text-ink line-clamp-1">
                    {print.title}
                  </h2>
                  <p className="text-[12px] text-caption mt-1 line-clamp-1 tabular">
                    {print.tags.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: masonry */}
          <div className="hidden md:block columns-2 lg:columns-3 gap-4">
            {filteredPrints.map((print, index) => (
              <Link
                key={print.id}
                to={`/print/${print.slug}`}
                className={`project-card group block mb-4 break-inside-avoid rounded-[3px] border border-border bg-white transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="relative overflow-hidden bg-cream">
                  <img
                    src={print.images[0]}
                    alt={print.title}
                    className="w-full h-auto max-h-[70vh] object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                </div>

                <div className="p-4">
                  <h2 className="font-heading font-semibold text-[15px] tracking-heading text-ink">
                    {print.title}
                  </h2>
                  <p className="text-[12px] text-caption mt-1 tabular">
                    {print.tags.join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <SiteFooter />
      <FloatingNav />
    </>
  );
};

export default Gallery;
