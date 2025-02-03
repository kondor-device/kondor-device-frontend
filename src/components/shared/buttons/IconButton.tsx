interface IconButtonProps {
  handleClick: () => void;
  children: React.JSX.Element;
  className?: string;
}

export default function IconButton({
  handleClick,
  children,
  className = "",
}: IconButtonProps) {
  return (
    <button
      aria-label="icon button"
      type="button"
      onClick={handleClick}
      className={`outline-none ${className}`}
    >
      {children}
    </button>
  );
}
