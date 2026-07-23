import { memo } from 'react';
import { Badge } from '../common/Badge/Badge';
import { Price } from '../common/Price/Price';
import { QuantityStepper } from '../common/QuantityStepper/QuantityStepper';
import { VariantSelector } from './VariantSelector';
import type { VariantOption } from './VariantSelector';
import type { BadgeData } from '../../types/catalog.types';
import './ProductCard.scss';

export interface ProductCardProps {
  productId: string;
  name: string;
  description: string;
  image: string;
  badge?: BadgeData;
  learnMoreUrl?: string;
  learnMoreLabel?: string;
  /** Omitted entirely for simple (non-variant) products. */
  variants?: VariantOption[];
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  isOutOfStock?: boolean;
  isLowStock?: boolean;
  lowStockLabel?: string;
  isSelected?: boolean;
  className?: string;
  /**
   * 'default' (the original vertical tile) is used by every category
   * unless told otherwise. 'camera' renders the horizontal, image-left
   * layout used only by the Cameras section reference design — every
   * other category keeps rendering exactly as before.
   */
  layout?: 'default' | 'camera';
}

/**
 * A product tile inside a category's grid. Pure view-model in, markup out —
 * resolving "which variant is selected -> what's its current price/stock"
 * is the selector layer's job, not this component's.
 *
 * Wrapped in React.memo: its parent (ProductCardContainer) subscribes
 * directly to BuilderStateContext and re-renders on every dispatch in the
 * app regardless of which product changed — that part can't be avoided
 * with memo, since Context updates bypass memo boundaries for direct
 * consumers. What memo DOES buy is that when the container re-renders for
 * a change to a *different* product, this card's own props (primitives,
 * plus the stabilized `variants` array and callbacks from
 * ProductCardContainer) come out equal, so React skips reconciling this
 * card's DOM entirely.
 */
export const ProductCard = memo(function ProductCard({
  name,
  description,
  image,
  badge,
  learnMoreUrl,
  learnMoreLabel = 'Learn More',
  variants,
  selectedVariantId,
  onVariantChange,
  price,
  compareAtPrice,
  quantity,
  maxQuantity,
  onQuantityChange,
  isOutOfStock = false,
  isLowStock = false,
  lowStockLabel = 'Low stock',
  isSelected = false,
  className = '',
  layout = 'default',
}: ProductCardProps) {
  // Derived, not stored: a discount ribbon takes priority over any editorial
  // badge (Best Seller, Recommended, ...), matching the reference design —
  // a discounted card shows "Save X%", never both at once. Cheap arithmetic
  // on primitives; recomputed per render is fine, memoizing it would be
  // pure overhead for a couple of comparisons.
  const hasMarkdown = compareAtPrice !== undefined && compareAtPrice > price;
  const savingsPercentage = hasMarkdown
    ? Math.round(((compareAtPrice as number - price) / (compareAtPrice as number)) * 100)
    : 0;

  const savingsBadge = hasMarkdown ? (
    <span className="product-card__badge">
      <Badge label={`Save ${savingsPercentage}%`} tone="primary" />
    </span>
  ) : (
    badge && (
      <span className="product-card__badge">
        <Badge label={badge.label} tone={badge.tone} />
      </span>
    )
  );

  if (layout === 'camera') {
    return (
      <div
        className={[
          'card product-card product-card--camera position-relative h-100',
          isSelected ? 'product-card--selected' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="product-card__media">
          {savingsBadge}
          <div className="product-card__image-wrap product-card__image-wrap--camera">
            <img src={image} alt={name} className="product-card__image" />
          </div>
        </div>

        <div className="card-body product-card__body product-card__body--camera d-flex flex-column gap-1">
          <h3 className="product-card__title mb-0">{name}</h3>

          <p className="product-card__description product-card__description--camera mb-0">
            {description}{' '}
            {learnMoreUrl && (
              <a href={learnMoreUrl} className="product-card__learn-more">
                {learnMoreLabel}
              </a>
            )}
          </p>

          {variants && variants.length > 0 && onVariantChange && (
            <VariantSelector
              name={name}
              options={variants}
              selectedId={selectedVariantId}
              onChange={onVariantChange}
              appearance="pill"
              className="product-card__variants my-1"
            />
          )}

          {isOutOfStock && (
            <Badge label="Out of stock" tone="danger" className="align-self-start" />
          )}
          {!isOutOfStock && isLowStock && (
            <Badge label={lowStockLabel} tone="warning" className="align-self-start" />
          )}

          <div className="product-card__footer product-card__footer--camera mt-auto d-flex align-items-center justify-content-between flex-wrap gap-2">
            <QuantityStepper
              label={`${name} quantity`}
              value={quantity}
              max={maxQuantity}
              onChange={onQuantityChange}
              disabled={isOutOfStock}
              size="sm"
            />
            <Price amount={price} compareAtPrice={compareAtPrice} size="md" align="end" emphasizeDiscount />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        'card product-card position-relative h-100',
        isSelected ? 'product-card--selected' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {savingsBadge}

      <div className="product-card__image-wrap">
        <img src={image} alt={name} className="product-card__image" />
      </div>

      <div className="card-body product-card__body d-flex flex-column gap-2">
        <h3 className="product-card__title mb-0">{name}</h3>

        <p className="product-card__description mb-0">
          {description}{' '}
          {learnMoreUrl && (
            <a href={learnMoreUrl} className="product-card__learn-more">
              {learnMoreLabel}
            </a>
          )}
        </p>

        {variants && variants.length > 0 && onVariantChange && (
          <VariantSelector
            name={name}
            options={variants}
            selectedId={selectedVariantId}
            onChange={onVariantChange}
          />
        )}

        {isOutOfStock && (
          <Badge label="Out of stock" tone="danger" className="align-self-start" />
        )}
        {!isOutOfStock && isLowStock && (
          <Badge label={lowStockLabel} tone="warning" className="align-self-start" />
        )}

        <div className="product-card__footer mt-auto d-flex align-items-center justify-content-between">
          <QuantityStepper
            label={`${name} quantity`}
            value={quantity}
            max={maxQuantity}
            onChange={onQuantityChange}
            disabled={isOutOfStock}
            size="sm"
          />
          <Price amount={price} compareAtPrice={compareAtPrice} size="md" emphasizeDiscount={false} />
        </div>
      </div>
    </div>
  );
});
