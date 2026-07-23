import type { DiscountEvaluator } from '../pricing.types';
import type { DiscountRuleType } from '../../../types/catalog.types';
import { evaluateBundleComplete } from './bundleComplete';
import { evaluateTieredByItemCount } from './tieredByItemCount';
import { evaluateCategoryMinQuantity } from './categoryMinQuantity';
import { evaluateFixedProductDiscount } from './fixedProductDiscount';

export const DISCOUNT_EVALUATORS: Record<DiscountRuleType, DiscountEvaluator> = {
  BUNDLE_COMPLETE: evaluateBundleComplete,
  TIERED_BY_ITEM_COUNT: evaluateTieredByItemCount,
  CATEGORY_MIN_QUANTITY: evaluateCategoryMinQuantity,
  FIXED_PRODUCT_DISCOUNT: evaluateFixedProductDiscount,
};
