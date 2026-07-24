export interface VariantOption {
  id: string;
  label: string;
  swatch?: string;
  image?: string;   // 👈 ضيف السطر ده
  disabled?: boolean;
}

export interface VariantSelectorProps {
  /** Groups radio inputs so multiple selectors on one page don't collide. */
  name: string;
  options: VariantOption[];
  selectedId?: string;
  onChange: (variantId: string) => void;
  size?: 'sm' | 'md';
  /**
   * 'swatch' (default) renders a plain circular color swatch — used by every
   * category that doesn't need a labeled control. 'pill' renders a
   * rectangular, labeled button (swatch dot + name) matching the Cameras
   * section's reference design. Both share the exact same props/behavior,
   * so callers never need to branch on anything but appearance.
   */
  appearance?: 'swatch' | 'pill';
  className?: string;
}

/**
 * Renders one control per variant option. Deliberately knows nothing about
 * "color" specifically — it renders whatever `options` it's given, using a
 * neutral fallback when no swatch color is provided, so the same component
 * keeps working if a future variant type doesn't have one.
 *
 * Selection is shown as a ring/border (never a fill), so the actual color
 * is never hidden. The variant's name is always available to assistive
 * tech: visually hidden in 'swatch' appearance (icon-only), visible text
 * in 'pill' appearance.
 */
export function VariantSelector({
  name,
  options,
  selectedId,
  onChange,
  appearance = 'swatch',
  className = '',
}: VariantSelectorProps) {
  return (
    <div
      className={`d-flex flex-wrap gap-2 ${className}`.trim()}
      role="radiogroup"
      aria-label={`${name} options`}
    >
      {options.map(option => {
        const isSelected = option.id === selectedId;

        if (appearance === 'pill') {
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={option.disabled}
              onClick={() => onChange(option.id)}
              className={`variant-pill ${isSelected ? 'variant-pill--selected' : ''}`.trim()}
              title={option.disabled ? `${option.label} — out of stock` : option.label}
            >
              {option.image ? (
              <img
                src={option.image}
                alt={option.label}
                className="variant-pill__image"
              />
            ) : (
              <span
                className="variant-pill__dot"
                style={{ backgroundColor: option.swatch ?? '#e5e7eb' }}
              />
            )}
              <span className="variant-pill__label">{option.label}</span>
            </button>
          );
        }

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => onChange(option.id)}
            className={`variant-swatch ${isSelected ? 'variant-swatch--selected' : ''}`.trim()}
            title={option.disabled ? `${option.label} — out of stock` : option.label}
          >
            <span
              className="variant-swatch__circle"
              style={{ backgroundColor: option.swatch ?? '#e5e7eb' }}
              aria-hidden="true"
            />
            <span className="visually-hidden">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
