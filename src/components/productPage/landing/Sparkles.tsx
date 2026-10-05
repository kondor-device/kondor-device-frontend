interface SparklesProps {
  color: string | null;
  className?: string;
}

// Three small decorative stars above a section title
export default function Sparkles({ color, className }: SparklesProps) {
  return (
    <span
      aria-hidden="true"
      className={["flex gap-1.5", className].filter(Boolean).join(" ")}
      style={{ color: color ?? "currentColor" }}
    >
      {[0, 1, 2].map((index) => (
        <svg key={index} viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M12 0c.6 6.6 4.8 11.4 12 12-7.2.6-11.4 5.4-12 12-.6-6.6-4.8-11.4-12-12C7.2 11.4 11.4 6.6 12 0Z" />
        </svg>
      ))}
    </span>
  );
}
