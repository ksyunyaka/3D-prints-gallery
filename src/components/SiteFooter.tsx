const SiteFooter = () => {
  return (
    <footer className="w-full border-t border-border bg-background pt-8 pb-28">
      <div className="px-6 text-center">
        <p className="text-xs text-muted-foreground">
          <a
            href="https://goraad.lovable.app/business"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors focus-ring"
          >
            Site made by Godt råd — Good advice for your business, 2026
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-1">CVR 46666089</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
