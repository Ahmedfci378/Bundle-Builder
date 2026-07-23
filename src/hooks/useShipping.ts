import { useCallback } from 'react';
import { useBuilderState } from './useBuilderState';
import { useBuilderDispatch } from './useBuilderDispatch';
import { useCatalog } from '../context/catalog/useCatalog';
import type { ShippingMethod, ShippingMethodId } from '../types/catalog.types';
import { selectEffectiveShippingMethodId } from '../state/selectors/pricingSelectors';

export interface UseShippingResult {
  methods: ShippingMethod[];
  effectiveMethodId: ShippingMethodId | null;
  setMethod: (methodId: ShippingMethodId) => void;
}

export function useShipping(): UseShippingResult {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const catalog = useCatalog();

  const methods = catalog.data?.shippingMethods ?? [];
  const effectiveMethodId = catalog.data ? selectEffectiveShippingMethodId(state, catalog.data) : null;

  const setMethod = useCallback(
    (methodId: ShippingMethodId) => {
      dispatch({ type: 'SET_SHIPPING_METHOD', payload: { methodId } });
    },
    [dispatch]
  );

  return { methods, effectiveMethodId, setMethod };
}
