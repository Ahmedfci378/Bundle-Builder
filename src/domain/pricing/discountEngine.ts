import type { CatalogPayload, DiscountRule } from '../../types/catalog.types';
import type { SelectionEntry } from '../../types/builder.types';
import type { AppliedDiscount } from './pricing.types';
import { DISCOUNT_EVALUATORS } from './discountEvaluators';

/**
 * Runs every discount rule in the catalog against the current selections and
 * returns only the ones that actually apply. This is the single place
 * discount rules are ever evaluated — usePricing() calls this once, and
 * every UI surface that needs to know "what discounts are active" reads
 * the result rather than re-running rule logic itself.
 */
export function evaluateDiscounts(
  entries: SelectionEntry[],
  catalog: CatalogPayload,
  subtotal: number,
  rules: DiscountRule[] = catalog.discountRules
): AppliedDiscount[] {
  const applied: AppliedDiscount[] = [];

  for (const rule of rules) {
    const evaluator = DISCOUNT_EVALUATORS[rule.type];
    const result = evaluator(rule, { entries, catalog, subtotal });
    if (result) applied.push(result);
  }

  return applied;
}
