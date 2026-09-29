import { cn } from "@/lib/utils/cn";

type StarRatingProps = {
  /** 0–5, fractions allowed (an average of 4.3 fills 4.3 stars). */
  value: number;
  size?: number;
  label: string;
  className?: string;
};

const STAR =
  "M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z";

/** Five hand-drawn stars; the gold layer is clipped to the rating. */
export function StarRating({
  value,
  size = 14,
  label,
  className,
}: StarRatingProps) {
  const percent = Math.max(0, Math.min(5, value)) * 20;
  const row = (filled: boolean) => (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          aria-hidden="true"
          focusable="false"
          className={filled ? "fill-gold text-gold" : "fill-none text-line"}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinejoin="round"
        >
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );

  return (
    <span
      role="img"
      aria-label={label}
      className={cn("relative inline-flex shrink-0", className)}
    >
      {row(false)}
      <span
        className="absolute inset-y-0 start-0 overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        {row(true)}
      </span>
    </span>
  );
}
