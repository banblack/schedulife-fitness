
import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

export const LiveRegion = ({ message, politeness = 'polite', atomic = true }: LiveRegionProps) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regionRef.current && message) {
      regionRef.current.textContent = message;
    }
  }, [message]);

  return (
    <div
      ref={regionRef}
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    />
  );
};
