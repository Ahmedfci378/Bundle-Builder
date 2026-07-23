import type { CSSProperties } from 'react';

export interface IconProps {
  /**
   * Bootstrap Icons class suffix, e.g. "camera-video", "shield-check", "truck".
   * Callers pass this straight from catalog data (Category.icon) — the
   * component itself never knows or cares which icons exist.
   */
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Purely decorative by default; set a label when the icon is the only content of a control. */
  ariaLabel?: string;
}

/**
 * Single reusable icon primitive. Every "icon" in this app is really just
 * this one component rendered with a different `name` — deliberately not
 * a library of one-off icon components, since the whole point of a
 * data-driven catalog is that new icons should never require new code.
 */
export function Icon({ name, size, className = '', style, ariaLabel }: IconProps) {
  const mergedStyle: CSSProperties = size ? { fontSize: size, ...style } : { ...style };

  return (
    <i
      className={`bi bi-${name} ${className}`.trim()}
      style={mergedStyle}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    />
  );
}
