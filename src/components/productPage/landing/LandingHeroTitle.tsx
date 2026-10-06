"use client";
import { useLayoutEffect, useRef } from "react";

interface LandingHeroTitleProps {
  children: string;
  /** Font size on a wide screen; the title shrinks below it so that it fits one line */
  maxSize?: number;
}

// The model name of the header is always one line: the font size is the biggest that fits
// the width of the header (up to maxSize), whatever the model name is.
export default function LandingHeroTitle({
  children,
  maxSize = 244,
}: LandingHeroTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    const text = textRef.current;

    if (!title || !text) return;

    const fit = () => {
      // The width of the text is proportional to the font size: measure it at 100px
      title.style.fontSize = "100px";
      const textWidth = text.getBoundingClientRect().width;
      const available = title.clientWidth;

      if (!textWidth || !available) return;

      const size = Math.min(maxSize, Math.floor((available / textWidth) * 100));
      title.style.fontSize = `${size}px`;
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(title);
    // The font may arrive after the first measurement
    document.fonts?.ready.then(fit);

    return () => observer.disconnect();
  }, [children, maxSize]);

  return (
    <h2
      ref={titleRef}
      // Before the script runs: a size that is close for the usual model names
      style={{ fontSize: "min(12vw, 244px)" }}
      className="mt-6 tab:mt-4 font-actay leading-none uppercase whitespace-nowrap overflow-x-clip"
    >
      <span ref={textRef} className="inline-block">
        {children}
      </span>
    </h2>
  );
}
