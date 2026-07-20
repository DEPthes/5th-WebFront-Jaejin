import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 850, enabled = true) {
  const [value, setValue] = useState(() => (enabled ? 0 : target));

  useEffect(() => {
    if (
      !enabled ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * easedProgress));

      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    setValue(0);
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, enabled]);

  return value;
}
