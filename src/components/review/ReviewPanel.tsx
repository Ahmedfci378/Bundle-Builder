import type { ReactNode } from 'react';
import { ReviewItem } from './ReviewItem';
import type { ReviewItemProps } from './ReviewItem';
import { CheckoutSummary } from './CheckoutSummary';
import type { CheckoutSummaryProps } from './CheckoutSummary';

export interface ReviewGroup {
  categoryId: string;
  categoryName: string;
  items: (ReviewItemProps & { productId: string })[];
}

export type ReviewPanelLayout = 'sidebar' | 'stacked';

export interface ReviewPanelProps {
  title: string;
  description?: string;
  groups: ReviewGroup[];
  shippingLine?: ReviewItemProps & { productId: string };
  summary: CheckoutSummaryProps;
  emptyState?: ReactNode;
  /**
   * 'sidebar' (desktop, ≥lg): narrow sticky column next to the accordion —
   * everything stacks vertically because there isn't room for an internal
   * split. 'stacked' (tablet/mobile): a full-width card below the
   * accordion — wide enough at tablet widths to show items and the summary
   * side by side, and Bootstrap's own col-md-* naturally collapses that
   * back to one column at true mobile widths. This is a layout MODE, not
   * just a viewport size, which is why it's a prop rather than a bare
   * media query inside this component (see BundleBuilderPage).
   */
  layout: ReviewPanelLayout;
}

/**
 * Renders whatever grouped line items it's handed. It never computes totals,
 * groups selections by category itself, or knows how pricing works — all of
 * that is resolved once, upstream, by selectors + usePricing(), and passed
 * in as plain data. That's what guarantees this panel can never show a
 * number that disagrees with the rest of the app: there is only one place
 * the numbers are computed, and this component just displays the result.
 */
export function ReviewPanel({ title, description, groups, shippingLine, summary, emptyState, layout }: ReviewPanelProps) {
  const hasItems = groups.some(group => group.items.length > 0);
  const isStacked = layout === 'stacked';

  const itemsList = (
    <div className="d-flex flex-column">
      {groups
        .filter(group => group.items.length > 0)
        .map(group => (
          <div key={group.categoryId} className="mb-2">
            <div className="small text-uppercase text-body-secondary mt-2">{group.categoryName}</div>
            {group.items.map(item => (
              <ReviewItem key={item.productId} {...item} />
            ))}
          </div>
        ))}

      {shippingLine && (
        <div className="mb-2">
          <ReviewItem {...shippingLine} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`bg-light rounded-4 p-4 ${isStacked ? '' : 'sticky-top'}`}
      style={isStacked ? undefined : { top: '1rem' }}
    >
      <h2 className="h5 fw-semibold mb-1">{title}</h2>
      {description && <p className="small text-body-secondary">{description}</p>}

      {!hasItems && emptyState}

      {hasItems && isStacked && (
        <div className="row g-4">
          <div className="col-12 col-md-7">{itemsList}</div>
          <div className="col-12 col-md-5">
            <CheckoutSummary {...summary} />
          </div>
        </div>
      )}

      {hasItems && !isStacked && (
        <>
          {itemsList}
          <CheckoutSummary {...summary} />
        </>
      )}

      {!hasItems && <CheckoutSummary {...summary} />}
    </div>
  );
}
