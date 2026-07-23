import { useMemo } from 'react';
import { useBuilderState } from './useBuilderState';
import { useCatalog } from '../context/catalog/useCatalog';
import type { AppliedDiscount } from '../domain/pricing/pricing.types';
import {
  selectListSubtotal,
  selectSubtotal,
  selectMarkdownSavings,
  selectAppliedDiscounts,
  selectDiscountTotal,
  selectShippingCost,
  selectGrandTotal,
  selectTotalSavings,
  selectSavingsPercentage,
} from '../state/selectors/pricingSelectors';

export interface PricingBreakdown {
  listSubtotal: number;
  subtotal: number;
  markdownSavings: number;
  appliedDiscounts: AppliedDiscount[];
  discountTotal: number;
  shippingCost: number;
  grandTotal: number;
  totalSavings: number;
  savingsPercentage: number;
}

const EMPTY: PricingBreakdown = {
  listSubtotal: 0,
  subtotal: 0,
  markdownSavings: 0,
  appliedDiscounts: [],
  discountTotal: 0,
  shippingCost: 0,
  grandTotal: 0,
  totalSavings: 0,
  savingsPercentage: 0,
};

/**
 * Composes every pricing selector into the single object the Review Panel
 * renders. This hook contains zero arithmetic of its own — it exists only
 * to memoize the selector calls against the state/catalog they depend on,
 * so re-renders don't redo the discount engine's work unnecessarily.
 */
export function usePricing(): PricingBreakdown {
  const state = useBuilderState();
  const catalog = useCatalog();

  return useMemo(() => {
    if (!catalog.data) return EMPTY;
    const data = catalog.data;
    return {
      listSubtotal: selectListSubtotal(state, data),
      subtotal: selectSubtotal(state, data),
      markdownSavings: selectMarkdownSavings(state, data),
      appliedDiscounts: selectAppliedDiscounts(state, data),
      discountTotal: selectDiscountTotal(state, data),
      shippingCost: selectShippingCost(state, data),
      grandTotal: selectGrandTotal(state, data),
      totalSavings: selectTotalSavings(state, data),
      savingsPercentage: selectSavingsPercentage(state, data),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately narrowed: only these slices affect pricing
  }, [state.selections, state.selectedShippingMethodId, catalog.data]);
}
