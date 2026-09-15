import HeartMark from "@/components/brand/HeartMark";

const SiteFooter = () => {
  return (
    <footer className="footer-safe-area fixed bottom-0 left-0 right-0 z-30 bg-ink pt-4">
      <div className="mx-auto max-w-[1180px] px-6 text-center">
        <a
          href="https://goraad.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block focus-ring"
        >
          <span
            className="block font-heading font-semibold uppercase text-caption-dark"
            style={{ fontSize: "9px", letterSpacing: "0.22em" }}
          >
            Built by
          </span>
          <span className="mt-1 flex items-start justify-center gap-1">
            <span
              className="font-heading font-bold text-cream-card leading-none"
              style={{ fontSize: "22px", letterSpacing: "-0.03em" }}
            >
              GoRåd
            </span>
            <HeartMark size={15} stroke="hsl(var(--teal))" />
          </span>
          <span className="mt-1 flex items-baseline justify-center gap-1.5">
            <span className="text-[11px] text-caption-dark">by</span>
            <span
              className="font-script text-cream-card leading-none"
              style={{ fontSize: "21px" }}
            >
              Oksana
            </span>
          </span>
        </a>
        <p className="mt-2 text-[11px] text-caption-dark">CVR 46666089</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
