interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}

const SectionHeader = ({
  eyebrow,
  title,
  as: Tag = "h2",
  align = "left",
  className = "",
}: SectionHeaderProps) => (
  <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
    <Tag className="font-heading font-bold tracking-heading text-ink text-2xl md:text-3xl">
      {title}
    </Tag>
    <span className={`accent-bar mt-4 ${align === "center" ? "mx-auto" : ""}`} />
  </div>
);

export default SectionHeader;
