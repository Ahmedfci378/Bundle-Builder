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

}: ReviewItemProps) {
  return (
<div className="d-flex align-items-center gap-3 review-item">
      {image ? (
<img src={image} alt="" className="rounded border review-item__thumb" />      ) : (
        <span className="rounded border d-flex align-items-center justify-content-center text-body-secondary review-item__thumb">
          <Icon
      name={icon ?? ICON.CART_CHECK}
      style={{ color: '#0AA288' }}
    />
        </span>
      )}
      <div className="flex-grow-1 min-w-0" style={{ maxWidth: '120px' }}>
 
 <div className="fw-medium text-truncate review-item__name">
  {name === 'Cam Unlimited' ? (
    <>
      <span style={{ color: '#000000' }}>Cam</span>{' '}
      <span style={{ color: '#4E2FD2' }}>Unlimited</span>
    </>
  ) : (
    name
  )}
</div>

 {variantLabel && <div className="text-body-secondary review-item__variant">{variantLabel}</div>}
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
        <span className="small text-body-secondary"></span>
        
      )}

{freeLabel ? (
  <div className="ms-auto">
    <Price
      amount={price * quantity}
      compareAtPrice={compareAtPrice ? compareAtPrice * quantity : undefined}
      freeLabel={freeLabel}
      size="md"
    />
  </div>
) : (
  <Price
    amount={price * quantity}
    compareAtPrice={compareAtPrice ? compareAtPrice * quantity : undefined}
    freeLabel={freeLabel}
    size="sm"
  />
)}
      
    </div>
  );
}
