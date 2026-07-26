import type { ReactNode } from 'react';
import { Price } from '../common/Price/Price';
import { Button } from '../common/Button/Button';

export interface CheckoutSummaryProps {
  listTotal: number;
  total: number;
  savingsAmount: number;
  savingsPercentage: number;
  financingText?: string;
  onCheckout: () => void;
  onSaveForLater?: () => void;
  isCheckoutDisabled?: boolean;
  /** Optional decorative slot (e.g. a trust/guarantee seal) — left generic on purpose. */
  seal?: ReactNode;
}

/**
 * The final totals block. All numbers arrive as props, already computed by
 * usePricing() — this component performs zero arithmetic itself, so the
 * pricing formula only ever exists in one place (the pricing selectors).
 */
export function CheckoutSummary({
  listTotal,
  total,
  savingsAmount,
  savingsPercentage,
  financingText,
  onCheckout,
  onSaveForLater,
  isCheckoutDisabled = false,
  seal,
}: CheckoutSummaryProps) {
  const hasSavings = savingsAmount > 0;

  return (
    <div className="d-flex flex-column gap-3 pt-3 border-top">
      <div className="d-flex align-items-start justify-content-between gap-3">
        {seal}
        <img
    src="/images/products/certificate/summary-icon.png"
    alt="Summary"
    style={{
      width: '70px',
      height: '70px',
      objectFit: 'contain'
    }}
  />
        <div className="ms-auto text-end">
<div
  style={{
    background: '#4E2FD2',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 12px',
    display: 'inline-block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 600,
  }}
>
  as low as $19.19/mo
</div>

<div className="d-flex align-items-center justify-content-end gap-5">
  {hasSavings && (
    <span
      className="text-decoration-line-through text-body-secondary"
      style={{ fontSize: '13px' }}
    >
      ${listTotal.toFixed(2)}
    </span>
  )}

        <div
          style={{
            color: '#4E2FD2',
            transform: 'scale(1.5)',
            transformOrigin: 'right center',
          }}
        >
          <Price amount={total} size="xl" />
        </div>  
        </div>
        </div>
      </div>

      {hasSavings && (
                <p
          className="text-success fw-medium mb-0"
          style={{
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          Congrats! You're saving {savingsAmount.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}{' '}
          ({Math.round(savingsPercentage * 100)}%) on your bundle.
        </p>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={onCheckout} disabled={isCheckoutDisabled}>
        Checkout
      </Button>

      {onSaveForLater && (
        <button type="button" className="btn btn-link text-center small text-decoration-underline" onClick={onSaveForLater}
        style={{ color: '#484848'}}>
          Save my system for later
        </button>
      )}
    </div>
  );
}
