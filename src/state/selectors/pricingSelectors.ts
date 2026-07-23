import type { BuilderState } from '../../types/builder.types';
import type { CatalogPayload, ShippingMethodId } from '../../types/catalog.types';
import { calculateSubtotal, calculateListSubtotal } from '../../domain/pricing/calculateSubtotal';
import { evaluateDiscounts } from '../../domain/pricing/discountEngine';
import type { AppliedDiscount } from '../../domain/pricing/pricing.types';
import { selectSelectedEntries } from './selectionSelectors';

export function selectListSubtotal(state: BuilderState, catalog: CatalogPayload): number {
  return calculateListSubtotal(selectSelectedEntries(state), catalog);
}

export function selectSubtotal(state: BuilderState, catalog: CatalogPayload): number {
  return calculateSubtotal(selectSelectedEntries(state), catalog);
}

/** Savings baked into per-item sale pricing (compareAtPrice), separate from bundle-level rule discounts. */
export function selectMarkdownSavings(state: BuilderState, catalog: CatalogPayload): number {
  return selectListSubtotal(state, catalog) - selectSubtotal(state, catalog);
}

export function selectAppliedDiscounts(state: BuilderState, catalog: CatalogPayload): AppliedDiscount[] {
  const entries = selectSelectedEntries(state);
  const subtotal = calculateSubtotal(entries, catalog);
  return evaluateDiscounts(entries, catalog, subtotal);
}

export function selectDiscountTotal(state: BuilderState, catalog: CatalogPayload): number {
  return selectAppliedDiscounts(state, catalog).reduce((sum, d) => sum + d.amount, 0);
}

/**
 * Resolves the user's shipping choice, falling back to the catalog's first
 * method when no explicit choice has been made yet. This is the ONLY place
 * that fallback happens — state stores just the (possibly null) override.
 */
export function selectEffectiveShippingMethodId(
  state: BuilderState,
  catalog: CatalogPayload
): ShippingMethodId | null {
  return state.selectedShippingMethodId ?? catalog.shippingMethods[0]?.id ?? null;
}

export function selectShippingCost(state: BuilderState, catalog: CatalogPayload): number {
  const methodId = selectEffectiveShippingMethodId(state, catalog);
  const method = catalog.shippingMethods.find(m => m.id === methodId);
  if (!method) return 0;

  const subtotal = selectSubtotal(state, catalog);
  if (method.freeThreshold !== undefined && subtotal >= method.freeThreshold) return 0;
  return method.cost;
}

export function selectGrandTotal(state: BuilderState, catalog: CatalogPayload): number {
  const subtotal = selectSubtotal(state, catalog);
  const discountTotal = selectDiscountTotal(state, catalog);
  const shippingCost = selectShippingCost(state, catalog);
  return subtotal - discountTotal + shippingCost;
}

/** The single "You saved $X" figure — markdown savings plus rule-based discounts, combined. */
export function selectTotalSavings(state: BuilderState, catalog: CatalogPayload): number {
  return selectMarkdownSavings(state, catalog) + selectDiscountTotal(state, catalog);
}

export function selectSavingsPercentage(state: BuilderState, catalog: CatalogPayload): number {
  const listSubtotal = selectListSubtotal(state, catalog);
  if (listSubtotal <= 0) return 0;
  return selectTotalSavings(state, catalog) / listSubtotal;
}
