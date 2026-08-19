import { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
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
          className="pt-32 md:pt-24 pb-24 px-6 max-w-[1400px] mx-auto w-full"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-destructive py-24">
              Couldn't load the gallery. {errorMessage(error)}
            </p>
          )}

          {!isLoading && !error && filteredPrints.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-24">
              No prints here yet.
            </p>
          )}

          {/* Mobile: Pinterest-style 2-column grid with equal sizes */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {filteredPrints.map((print, index) => (
              <Link
                key={print.id}
                to={`/print/${print.slug}`}
                className={`project-card group block transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[4/5]">
                  <img
                    src={print.images[0]}
                    alt={print.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="pt-2 pb-3">
                  <h3 className="text-xs font-medium group-hover:opacity-70 transition-opacity duration-300 line-clamp-1">
                    {print.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                    {print.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: Masonry layout */}
          <div className="hidden md:block columns-2 lg:columns-3 3xl:columns-4 gap-4">
            {filteredPrints.map((print, index) => (
              <Link
                key={print.id}
                to={`/print/${print.slug}`}
                className={`project-card group block mb-4 break-inside-avoid transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-muted">
                  <img
                    src={print.images[0]}
                    alt={print.title}
                    className="w-full h-auto max-h-[70vh] object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, 50vw"
                  />
                </div>

                <div className="pt-3 pb-4">
                  <h3 className="text-sm font-medium group-hover:opacity-70 transition-opacity duration-300">
                    {print.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {print.tags.map((tag) => `#${tag}`).join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <FloatingNav />
    </>
  );
};

export default Gallery;
