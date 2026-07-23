import { useCallback, useMemo } from 'react';
import { useBuilderState } from './useBuilderState';
import { useBuilderDispatch } from './useBuilderDispatch';
import { useCatalog } from '../context/catalog/useCatalog';
import type { CategoryId } from '../types/catalog.types';
import { selectCategoryProgress } from '../state/selectors/categorySelectors';
import type { CategoryProgress } from '../state/selectors/categorySelectors';

export interface UseAccordionSectionResult {
  isExpanded: boolean;
  progress: CategoryProgress;
  toggle: () => void;
}

export function useAccordionSection(categoryId: CategoryId): UseAccordionSectionResult {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const catalog = useCatalog();

  const isExpanded = state.expandedCategoryIds.includes(categoryId);

  const progress = useMemo(
    () =>
      catalog.data
        ? selectCategoryProgress(state, catalog.data, categoryId)
        : { selectedQuantity: 0, isSatisfied: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selectCategoryProgress only reads state.selections
    [state.selections, catalog.data, categoryId]
  );

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_ACCORDION_SECTION', payload: { categoryId } });
  }, [dispatch, categoryId]);

  return { isExpanded, progress, toggle };
}
