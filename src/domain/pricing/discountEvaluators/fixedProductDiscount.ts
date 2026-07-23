import type { DiscountEvaluator } from '../pricing.types';
import { findProduct, getEffectivePrice } from '../../catalog/catalogHelpers';

/**
 * condition: { productId: string }
 * value: flat currency amount off PER UNIT of that product.
 */
export const evaluateFixedProductDiscount: DiscountEvaluator = (rule, ctx) => {
  const productId = rule.condition?.productId as string | undefined;
  if (!productId) return null;

  const matching = ctx.entries.filter(entry => entry.productId === productId);
  if (matching.length === 0) return null;

  let amount = 0;
  for (const entry of matching) {
    const product = findProduct(ctx.catalog, entry.productId);
    if (!product) continue;
    const lineTotal = getEffectivePrice(product, entry.variantId) * entry.quantity;
    const discount = Math.min(rule.value * entry.quantity, lineTotal);
    amount += discount;
  }

  return amount > 0 ? { ruleId: rule.id, label: rule.label, amount } : null;
};
