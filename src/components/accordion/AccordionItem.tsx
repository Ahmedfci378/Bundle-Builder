import type { ReactNode } from 'react';
import { Icon } from '../common/Icon/Icon';
import { ICON } from '../common/Icon/iconNames';

export interface AccordionItemProps {
  id: string;
  title: string;
  /** e.g. "STEP 1 OF 4" — computed by the caller from category order, never hardcoded here. */
  eyebrow?: string;
  /** Bootstrap Icons name, e.g. "camera-video". Comes straight from catalog data. */
  icon?: string;
  /** e.g. "2 selected" — computed by the caller from selection state. */
  meta?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * A single collapsible section. Knows nothing about categories, products,
 * or the wizard concept — it only renders a header (icon + title + eyebrow
 * + meta + chevron) and toggles visibility of its children. This is what
 * lets the same component represent "Choose your cameras" and "Choose your
 * plan" with completely different content and selection rules inside.
 */
export function AccordionItem({
  id,
  title,
  eyebrow,
  icon,
  meta,
  isOpen,
  onToggle,
  children,
}: AccordionItemProps) {
  const panelId = `accordion-panel-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div className="border-bottom">
      {eyebrow && (
        <div className="small text-body-secondary text-uppercase mt-3 mb-1 accordion-step-label">{eyebrow}</div>
      )}

      <h2 className="mb-0">
        <button
          type="button"
          id={headerId}
          className="btn w-100 d-flex align-items-center justify-content-between py-3 px-0 border-0 bg-transparent text-start"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="d-flex align-items-center gap-2 fw-semibold fs-5">
            {icon && <Icon name={icon} />}
            {title}
          </span>

          <span className="d-flex align-items-center gap-2">
            {meta && <span className="small text-primary fw-medium">{meta}</span>}
            <Icon name={isOpen ? ICON.CHEVRON_UP : ICON.CHEVRON_DOWN} />
          </span>
        </button>
      </h2>

      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={headerId} className="pb-4" style={{
          background: "#EDF4FF",
          borderRadius: "24px",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
