import { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import SiteFooter from "@/components/SiteFooter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePrintBySlug, usePrints } from "@/hooks/usePrints";
import { errorMessage } from "@/lib/errors";

const PrintDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: print, isLoading, error } = usePrintBySlug(slug);
  const { data: allPrints } = usePrints();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const published = useMemo(
    () => (allPrints ?? []).filter((item) => item.published),
    [allPrints],
  );

  if (isLoading) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </main>
        <SiteFooter />
        <FloatingNav />
      </>
    );
  }

  if (error || !print) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-40 page-bottom-safe px-6 text-center">
            <h1 className="text-headline mb-4">Print not found</h1>
            {error && <p className="text-sm text-destructive mb-4">{errorMessage(error)}</p>}
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring">
              Back to Home
            </Link>
          </div>
        </main>
        <SiteFooter />
        <FloatingNav />
      </>
    );
  }

  const currentIndex = published.findIndex((item) => item.id === print.id);
  const prevPrint = currentIndex > 0 ? published[currentIndex - 1] : null;
  const nextPrint =
    currentIndex !== -1 && currentIndex < published.length - 1 ? published[currentIndex + 1] : null;

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar />

        {/* Hero Image */}
        <section className="pt-20 px-4 md:px-6 max-w-[1200px] mx-auto w-full">
          <div className="w-full overflow-hidden rounded-2xl md:rounded-3xl bg-muted fade-in-up flex items-center justify-center">
            <img
              src={print.images[0]}
              alt={print.title}
              className="w-auto max-w-full max-h-[55vh] md:max-h-[78vh] object-contain"
              decoding="async"
            />
          </div>
        </section>

        {/* Print Info */}
        <section className="py-8 px-6 max-w-[1200px] mx-auto w-full">
          <div className="max-w-4xl">
            <div className="mb-6 fade-in-up fade-in-up-delay-1">
              <h1 className="text-display mb-3">{print.title}</h1>
              <p className="text-sm text-muted-foreground">
                {print.tags.map((tag) => `#${tag}`).join(" ")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 fade-in-up fade-in-up-delay-2">
              {print.year && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Year</p>
                  <p className="text-sm">{print.year}</p>
                </div>
              )}
              {print.material && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Material</p>
                  <p className="text-sm">{print.material}</p>
                </div>
              )}
              {print.sourceName && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Source</p>
                  {print.sourceUrl ? (
                    <a
                      href={print.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-2 hover:text-foreground transition-colors focus-ring"
                    >
                      {print.sourceName}
                    </a>
                  ) : (
                    <p className="text-sm">{print.sourceName}</p>
                  )}
                </div>
              )}
              {print.stlUrl && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Model file</p>
                  <a
                    href={print.stlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline underline-offset-2 hover:text-foreground transition-colors focus-ring"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>

            {print.description && (
              <div className="max-w-2xl fade-in-up fade-in-up-delay-3">
                <p className="text-lg leading-relaxed text-foreground/90">{print.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        {print.images.length > 1 && (
          <section className="py-6 px-6 max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {print.images.slice(1).map((image, index) => (
                <div
                  key={image}
                  className="w-full overflow-hidden rounded-3xl bg-muted fade-in-up flex items-center justify-center"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <img
                    src={image}
                    alt={`${print.title} - ${index + 2}`}
                    className="w-auto max-w-full max-h-[60vh] object-contain"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <section className="py-12 px-6 border-t border-border">
          <div className="flex items-center justify-between">
            {prevPrint ? (
              <button
                onClick={() => navigate(`/print/${prevPrint.slug}`)}
                className="group flex items-center gap-3 text-left hover:text-foreground transition-colors duration-300 focus-ring"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-300" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Previous</p>
                  <p className="text-sm">{prevPrint.title}</p>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextPrint ? (
              <button
                onClick={() => navigate(`/print/${nextPrint.slug}`)}
                className="group flex items-center gap-3 text-right hover:text-foreground transition-colors duration-300 focus-ring"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Next</p>
                  <p className="text-sm">{nextPrint.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingNav />
    </>
  );
};

export default PrintDetail;
