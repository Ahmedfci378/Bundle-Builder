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
        <div className="ms-auto text-end">
          {financingText && <div className="small text-body-secondary mb-1">{financingText}</div>}
          <Price amount={total} compareAtPrice={hasSavings ? listTotal : undefined} size="xl" />
        </div>
      </div>

      {hasSavings && (
        <p className="text-success small fw-medium mb-0">
          Congrats! You're saving {savingsAmount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}{' '}
          ({Math.round(savingsPercentage * 100)}%) on your bundle.
        </p>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={onCheckout} disabled={isCheckoutDisabled}>
        Checkout
      </Button>

      {onSaveForLater && (
        <button type="button" className="btn btn-link text-center small text-decoration-underline" onClick={onSaveForLater}>
          Save my system for later
        </button>
      )}
    </div>
  );
}
