interface IconButtonProps {
  handleClick: () => void;
  children: React.JSX.Element;
  className?: string;
  "data-label"?: string;
}

export default function IconButton({
  handleClick,
  children,
  className = "",
  "data-label": dataLabel,
}: IconButtonProps) {
  return (
    <button
      aria-label="icon button"
      type="button"
      onClick={handleClick}
      className={`outline-none ${className}`}
      data-label={dataLabel}
    >
      {children}
    </button>
  );
}
