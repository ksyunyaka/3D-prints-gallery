const SiteFooter = () => {
  return (
    <footer className="w-full border-t border-border bg-background pt-8 pb-32">
      <div className="px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Site made by{" "}
          <a
            href="https://goraad.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors focus-ring"
          >
            Godt råd
          </a>{" "}
          — Good advice for your business, 2026
        </p>
        <p className="text-xs text-muted-foreground mt-1">CVR 46666089</p>
      </div>

    </footer>
  );
};

export default SiteFooter;
