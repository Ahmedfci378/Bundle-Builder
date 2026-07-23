import type { ReactNode } from 'react';

export interface AccordionProps {
  children: ReactNode;
  className?: string;
  /** Accessible label for the whole group, e.g. "Build your security system". */
  ariaLabel?: string;
}

/**
 * Layout-only wrapper around a list of AccordionItems. It intentionally
 * holds no state — which sections are open is a real piece of application
 * state (see the state design doc, §1: `expandedCategoryIds`), and letting
 * this component manage its own open/closed state would create a second,
 * conflicting source of truth the moment it needs to be controlled from
 * outside (e.g. "expand this category after loading a saved configuration").
 */
export function Accordion({ children, className = '', ariaLabel }: AccordionProps) {
  return (
    <div className={`d-flex flex-column ${className}`} role="group" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
