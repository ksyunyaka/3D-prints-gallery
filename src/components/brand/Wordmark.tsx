import HeartMark from "./HeartMark";

interface WordmarkProps {
  /** Wordmark font size in px. Great Vibes is never used below 40px. */
  size?: number;
  heartSize?: number;
  /** One-colour version: wordmark and heart both Deep Ocean. */
  monochrome?: boolean;
  className?: string;
}

const Wordmark = ({ size = 40, heartSize = 15, monochrome = false, className = "" }: WordmarkProps) => (
  <span className={`relative inline-flex items-start ${className}`}>
    <span
      className="font-script leading-none text-ink"
      style={{ fontSize: `${size}px`, lineHeight: 1.05 }}
    >
      Oksana
    </span>
    <HeartMark
      size={heartSize}
      className={monochrome ? "text-ink" : "text-lavender"}
    />
  </span>
);

export default Wordmark;
