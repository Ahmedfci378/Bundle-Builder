import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query's match state, updating live on resize. Generic
 * and domain-agnostic — used here to make one specific layout decision
 * (does the Review Panel sit in a sidebar or stack full-width?) that plain
 * Bootstrap col-* classes can't express, because that decision depends on
 * which grid slot a component is rendered into, not just the viewport
 * width in isolation.
 */
export function useMediaQuery(query: string): boolean {
  const getMatch = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQueryList.matches);

    handleChange(); // sync in case `query` itself changed between renders
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
