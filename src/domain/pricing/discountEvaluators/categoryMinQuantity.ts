import type { DiscountEvaluator } from '../pricing.types';
import { findProduct, getEffectivePrice } from '../../catalog/catalogHelpers';

/**
 * condition: { categoryId: string; minQuantity: number }
 * value: percentage off that category's OWN subtotal (not the whole cart) —
 * e.g. "3+ sensors -> 15% off sensors."
 */
export const evaluateCategoryMinQuantity: DiscountEvaluator = (rule, ctx) => {
  const categoryId = rule.condition?.categoryId as string | undefined;
  const minQuantity = rule.condition?.minQuantity as number | undefined;
  if (!categoryId || minQuantity === undefined) return null;

  let categorySubtotal = 0;
  let categoryQuantity = 0;

  for (const entry of ctx.entries) {
    const product = findProduct(ctx.catalog, entry.productId);
    if (!product || product.categoryId !== categoryId) continue;
    categoryQuantity += entry.quantity;
    categorySubtotal += getEffectivePrice(product, entry.variantId) * entry.quantity;
  }

  if (categoryQuantity < minQuantity) return null;

  const amount = categorySubtotal * (rule.value / 100);
  return amount > 0 ? { ruleId: rule.id, label: rule.label, amount } : null;
};
