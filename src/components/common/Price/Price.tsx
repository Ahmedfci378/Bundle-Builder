import { formatCurrency } from '../../../utils/formatCurrency';

export type PriceSize = 'sm' | 'md' | 'lg' | 'xl';

export interface PriceProps {
  amount: number;
  compareAtPrice?: number;
  currency?: string;
  locale?: string;
  size?: PriceSize;
  /** e.g. "/mo" for recurring plan pricing. */
  suffix?: string;
  /** Overrides the current-price text (e.g. "FREE" for an included item). */
  freeLabel?: string;
  /** Right-align the block — used in line-item lists where price sits at the row's end. */
  align?: 'start' | 'end';
  /** Tint the current price brand-primary when discounted (default true). Set false for a neutral dark price, e.g. ProductCard. */
  emphasizeDiscount?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<PriceSize, string> = {
  sm: '',
  md: '',
  lg: '',
  xl: '',
};

/**
 * Renders a current price, with an optional struck-through compareAtPrice
 * above/beside it, or a `freeLabel` override (e.g. a bundled hub shown as
 * "FREE" instead of "$0.00"). This is the ONLY component that formats a
 * money value or decides how a markdown is displayed — every other
 * component asks this one to render a price rather than re-implementing
 * the strikethrough + currency formatting itself.
 */
export function Price({
  amount,
  compareAtPrice,
  currency = 'USD',
  locale = 'en-US',
  size = 'md',
  suffix,
  freeLabel,
  align = 'end',
  emphasizeDiscount = true,
  className = '',
}: PriceProps) {
  const hasMarkdown = compareAtPrice !== undefined && compareAtPrice > amount;

  return (
    <div
      className={`d-flex flex-column ${align === 'end' ? 'align-items-end' : 'align-items-start'} ${className}`}
    style={{
    width: "35px",     // أو 50px حسب اللي يعجبك
    flexShrink: 0,
  }}
   >
      {hasMarkdown && (
        <span className="text-decoration-line-through text-body-secondary small"  style={{ fontSize: '13px' }}>
          {formatCurrency(compareAtPrice as number, currency, locale)}
        </span>
      )}
      <span className={`fw-semibold ${SIZE_CLASS[size]} ${hasMarkdown && emphasizeDiscount ? 'text-primary' : ''}`}
      style={{
    fontSize: '15px'
  }}>
        {freeLabel ?? formatCurrency(amount, currency, locale)}
        {suffix && <span className="fs-6 fw-normal text-body-secondary">{suffix}</span>}
      </span>
    </div>
  );
}
