import { ICON } from '../Icon/iconNames';
import { Icon } from '../Icon/Icon';

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (nextValue: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  /** Accessible name for the group, e.g. "Wyze Cam v4 quantity". */
  label: string;
}

/**
 * A fully controlled, presentational stepper — it never clamps or owns the
 * value itself, it only reports the value the user asked for via onChange.
 * Clamping against stock/config limits happens one layer up (the hook that
 * calls this), so this component stays reusable anywhere a bounded integer
 * input is needed, not just for catalog quantities.
 */
export function QuantityStepper({
  value,
  min = 0,
  max = Infinity,
  onChange,
  disabled = false,
  size = 'md',
  label,
}: QuantityStepperProps) {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;
  const btnSize = size === 'sm' ? 'btn-sm' : '';

  return (
    <div
      className="qty-stepper d-inline-flex align-items-center border rounded"
      role="group"
      aria-label={label}
       style={{
    transform: 'scale(0.9)',
    transformOrigin: 'center',
  }}
    >
      <button
        type="button"
        className={`btn btn-outline-secondary border-0 qty-stepper-btn ${btnSize}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={!canDecrement}
        aria-label={`Decrease ${label}`}
      >
        <Icon name={ICON.MINUS} ariaLabel={undefined} />
      </button>

      <span
        className="px-2 text-center fw-medium"
        style={{  minWidth: '1.5ch',
    fontSize: '10px',}}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        className={`btn btn-outline-secondary border-0 qty-stepper-btn ${btnSize}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={!canIncrement}
        aria-label={`Increase ${label}`}
      >
        <Icon name={ICON.PLUS} ariaLabel={undefined} />
      </button>
    </div>
  );
}
