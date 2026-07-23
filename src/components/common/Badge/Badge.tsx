import type { BadgeTone } from '../../../types/catalog.types';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

/**
 * Maps a semantic `tone` to a Bootstrap contextual class. This is the ONLY
 * place that mapping happens — the component never inspects `label` text
 * (e.g. never checks "does this say 'Best Seller'") to decide how to look,
 * so renaming any badge's copy in the catalog can never silently change its
 * color.
 */
const TONE_CLASS: Record<BadgeTone, string> = {
  primary: 'text-bg-primary',
  success: 'text-bg-success',
  info: 'text-bg-info',
  warning: 'text-bg-warning',
  danger: 'text-bg-danger',
  neutral: 'text-bg-secondary',
};

export function Badge({ label, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`badge rounded-pill ${TONE_CLASS[tone]} ${className}`.trim()}>
      {label}
    </span>
  );
}
