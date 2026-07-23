import { useCallback, useMemo } from 'react';
import { useBuilderState } from './useBuilderState';
import { useBuilderDispatch } from './useBuilderDispatch';
import { useCatalog } from '../context/catalog/useCatalog';
import type { Category, CategoryId } from '../types/catalog.types';

export interface UseCategoryNavigationResult {
  orderedCategories: Category[];
  /** The category that comes after `categoryId`, or undefined if it's the last one. */
  getNextCategory: (categoryId: CategoryId) => Category | undefined;
  /** Collapses `categoryId` and expands whatever comes next — the "Next" button's behavior. */
  goToNext: (categoryId: CategoryId) => void;
}

export function useCategoryNavigation(): UseCategoryNavigationResult {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const catalog = useCatalog();

  const orderedCategories = useMemo(
    () => (catalog.data ? [...catalog.data.categories].sort((a, b) => a.order - b.order) : []),
    [catalog.data]
  );

  const getNextCategory = useCallback(
    (categoryId: CategoryId) => {
      const index = orderedCategories.findIndex(c => c.id === categoryId);
      return index === -1 ? undefined : orderedCategories[index + 1];
    },
    [orderedCategories]
  );

  const goToNext = useCallback(
    (categoryId: CategoryId) => {
      const next = getNextCategory(categoryId);
      const withoutCurrent = state.expandedCategoryIds.filter(id => id !== categoryId);
      const categoryIds = next ? [...withoutCurrent, next.id] : withoutCurrent;
      dispatch({ type: 'SET_EXPANDED_SECTIONS', payload: { categoryIds } });
    },
    [dispatch, getNextCategory, state.expandedCategoryIds]
  );

  return { orderedCategories, getNextCategory, goToNext };
}
