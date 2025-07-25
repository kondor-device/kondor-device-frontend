import { useEffect } from "react";

interface BackdropProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

export default function Backdrop({
  isVisible = false,
  onClick,
  className = "",
}: BackdropProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClick();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClick]);

  return (
    <div
      className={`fixed z-[60] inset-0 w-dvw h-dvh bg-dark bg-opacity-40 transition duration-[1000ms] ease-in-out ${
        isVisible
          ? "opacity-100 no-doc-scroll"
          : "opacity-0 pointer-events-none"
      } ${className}`}
      onClick={onClick}
    />
  );
}
