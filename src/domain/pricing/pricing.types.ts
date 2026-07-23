import type { CatalogPayload, DiscountRule, Category } from '../../types/catalog.types';
import type { SelectionEntry } from '../../types/builder.types';

export interface AppliedDiscount {
  ruleId: string;
  label: string;
  amount: number;
}

export interface DiscountEvaluationContext {
  entries: SelectionEntry[];
  catalog: CatalogPayload;
  subtotal: number;
}

export type DiscountEvaluator = (rule: DiscountRule, ctx: DiscountEvaluationContext) => AppliedDiscount | null;

export interface CategoryTotals {
  category: Category;
  selectedQuantity: number;
}
