const SiteFooter = () => {
  return (
    <footer className="footer-safe-area fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md pt-3">
      <div className="px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Site made by{" "}
          <a
            href="https://goraad.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors focus-ring"
          >
            GodRåd
          </a>
          {"\u00a0-\u00a0"}Good advice for your business, 2026
        </p>
        <p className="text-xs text-muted-foreground mt-1">CVR 46666089</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
