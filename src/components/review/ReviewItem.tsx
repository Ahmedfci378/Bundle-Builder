import { Price } from '../common/Price/Price';
import { QuantityStepper } from '../common/QuantityStepper/QuantityStepper';
import { Icon } from '../common/Icon/Icon';
import { ICON } from '../common/Icon/iconNames';

export interface ReviewItemProps {
  image?: string;
  /** Bootstrap Icons name shown instead of an image when there's no product photo (e.g. the shipping line). */
  icon?: string;
  name: string;
  variantLabel?: string;
  price: number;
  compareAtPrice?: number;
  freeLabel?: string;
  quantity: number;
  maxQuantity?: number;
  /** When false, renders quantity as static text instead of a stepper and hides remove. */
  editable?: boolean;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}

/**
 * One line item. This is the single implementation shared by every place
 * the app shows "a selected product" (live review panel and, previously,
 * the review step) — duplicating this markup per surface is exactly the
 * kind of drift the architecture's DRY rule exists to prevent.
 */
export function ReviewItem({
  image,
  icon,
  name,
  variantLabel,
  price,
  compareAtPrice,
  freeLabel,
  quantity,
  maxQuantity = 10,
  editable = true,
  onQuantityChange,
  onRemove,
}: ReviewItemProps) {
  return (
    <div className="d-flex align-items-center gap-3 py-2">
      {image ? (
        <img src={image} alt="" className="rounded border" style={{ width: 40, height: 40, objectFit: 'contain' }} />
      ) : (
        <span
          className="rounded border d-flex align-items-center justify-content-center text-body-secondary"
          style={{ width: 40, height: 40 }}
        >
          <Icon name={icon ?? ICON.CART_CHECK} />
        </span>
      )}
      <div className="flex-grow-1 min-w-0">
        <div className="small fw-medium text-truncate">{name}</div>
        {variantLabel && <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>{variantLabel}</div>}
      </div>

      {editable && onQuantityChange ? (
        <QuantityStepper
          label={`${name} quantity`}
          value={quantity}
          max={maxQuantity}
          onChange={onQuantityChange}
          size="sm"
        />
      ) : (
        <span className="small text-body-secondary">Qty {quantity}</span>
      )}

      <Price amount={price * quantity} compareAtPrice={compareAtPrice ? compareAtPrice * quantity : undefined} freeLabel={freeLabel} size="sm" />

      {editable && onRemove && (
        <button
          type="button"
          className="btn btn-sm btn-link text-danger p-0"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          <Icon name={ICON.TRASH} />
        </button>
      )}
    </div>
  );
}
