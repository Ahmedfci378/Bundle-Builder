import { useCallback, useMemo } from 'react';
import { useBuilderState } from './useBuilderState';
import { useBuilderDispatch } from './useBuilderDispatch';
import { useCatalog } from '../context/catalog/useCatalog';
import type { Product, VariantId } from '../types/catalog.types';
import type { SelectionEntry } from '../types/builder.types';
import { clamp } from '../utils/clamp';
import { findProduct, findVariant, getMaxSelectableQuantity } from '../domain/catalog/catalogHelpers';

export interface UseSelectionResult {
  entry: SelectionEntry | undefined;
  product: Product | undefined;
  selectedVariantId: VariantId | undefined;
  maxQuantity: number;
  setVariant: (variantId: VariantId) => void;
  setQuantity: (quantity: number) => void;
  remove: () => void;
}

/**
 * Everything a ProductCard container needs for one product: the current
 * selection (if any), the resolved catalog product, and dispatch callbacks
 * that already clamp quantity against stock + config.maxQuantityPerVariant
 * before ever reaching the reducer. The reducer itself trusts its input —
 * clamping is a UI-facing concern, not a data invariant, so it lives here.
 */
export function useSelection(productId: string): UseSelectionResult {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const catalog = useCatalog();

  const entry = state.selections[productId];
  const product = catalog.data ? findProduct(catalog.data, productId) : undefined;

  const selectedVariantId = useMemo(() => {
    if (!product?.hasVariants) return undefined;
    return entry?.variantId ?? findVariant(product)?.id ?? product.defaultVariantId;
  }, [product, entry?.variantId]);

  const maxQuantity = useMemo(() => {
    if (!product || !catalog.data) return 0;
    return getMaxSelectableQuantity(product, selectedVariantId, catalog.data.config.maxQuantityPerVariant);
  }, [product, catalog.data, selectedVariantId]);

  const setVariant = useCallback(
    (variantId: VariantId) => {
      dispatch({ type: 'SET_VARIANT', payload: { productId, variantId } });
    },
    [dispatch, productId]
  );

  const setQuantity = useCallback(
    (quantity: number) => {
      const nextQuantity = clamp(quantity, 0, maxQuantity);
      dispatch({ type: 'SET_QUANTITY', payload: { productId, quantity: nextQuantity } });
    },
    [dispatch, productId, maxQuantity]
  );

  const remove = useCallback(() => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: { productId } });
  }, [dispatch, productId]);

  return { entry, product, selectedVariantId, maxQuantity, setVariant, setQuantity, remove };
}
