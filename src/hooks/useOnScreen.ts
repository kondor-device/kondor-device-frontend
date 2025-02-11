import { useEffect, useState } from "react";

export const useOnScreen = (
  id: string,
  { once = true, threshold = 0.5 }: { once?: boolean; threshold?: number } = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasInitialized(true);
        if (once) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        } else {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold }
    );

    const element = document.getElementById(id);

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [id, once, threshold]);

  return { isVisible, hasInitialized };
};
