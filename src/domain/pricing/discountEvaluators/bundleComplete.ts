import type { DiscountEvaluator } from '../pricing.types';
import { findProduct } from '../../catalog/catalogHelpers';

/**
 * condition: { requiredCategoryIds: string[] }
 * value: percentage (e.g. 10 = 10% off subtotal)
 */
export const evaluateBundleComplete: DiscountEvaluator = (rule, ctx) => {
  const requiredCategoryIds = (rule.condition?.requiredCategoryIds as string[] | undefined) ?? [];
  if (requiredCategoryIds.length === 0) return null;

  const selectedCategoryIds = new Set(
    ctx.entries
      .map(entry => findProduct(ctx.catalog, entry.productId)?.categoryId)
      .filter((id): id is string => Boolean(id))
  );

  const isComplete = requiredCategoryIds.every(id => selectedCategoryIds.has(id));
  if (!isComplete) return null;

  const amount = ctx.subtotal * (rule.value / 100);
  return amount > 0 ? { ruleId: rule.id, label: rule.label, amount } : null;
};
