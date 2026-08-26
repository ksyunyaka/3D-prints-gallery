interface HeartMarkProps {
  size?: number;
  className?: string;
  /** Stroke colour as a CSS colour value or CSS variable expression. */
  stroke?: string;
  rotate?: number;
}

/**
 * The recurring outline heart mark. Never filled, colour changes per project.
 */
const HeartMark = ({ size = 15, className = "", stroke, rotate = -8 }: HeartMarkProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke ?? "currentColor"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <path d="M12 20.5 4.2 12.7a4.9 4.9 0 0 1 0-6.9 4.9 4.9 0 0 1 6.9 0l.9.9.9-.9a4.9 4.9 0 0 1 6.9 0 4.9 4.9 0 0 1 0 6.9Z" />
  </svg>
);

export default HeartMark;
