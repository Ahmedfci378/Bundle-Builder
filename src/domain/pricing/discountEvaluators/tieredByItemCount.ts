import type { DiscountEvaluator } from '../pricing.types';

interface Tier {
  minItems: number;
  percentage: number;
}

/**
 * condition: { tiers: { minItems: number; percentage: number }[] }
 * `value` on the rule itself is unused — each tier carries its own percentage.
 */
export const evaluateTieredByItemCount: DiscountEvaluator = (rule, ctx) => {
  const tiers = (rule.condition?.tiers as Tier[] | undefined) ?? [];
  if (tiers.length === 0) return null;

  const totalItems = ctx.entries.reduce((sum, entry) => sum + entry.quantity, 0);

  const qualifyingTier = [...tiers]
    .sort((a, b) => b.minItems - a.minItems)
    .find(tier => totalItems >= tier.minItems);

  if (!qualifyingTier) return null;

  const amount = ctx.subtotal * (qualifyingTier.percentage / 100);
  return amount > 0 ? { ruleId: rule.id, label: rule.label, amount } : null;
};
