import { useMemo } from 'react';
import { useBuilderState } from './useBuilderState';
import { useCatalog } from '../context/catalog/useCatalog';
import type { CategoryId } from '../types/catalog.types';
import { selectCategoryProgress, selectIsBundleComplete } from '../state/selectors/categorySelectors';
import type { CategoryProgress } from '../state/selectors/categorySelectors';

export interface UseBundleCompletionResult {
  isBundleComplete: boolean;
  categoryProgress: Record<CategoryId, CategoryProgress>;
}

export function useBundleCompletion(): UseBundleCompletionResult {
  const state = useBuilderState();
  const catalog = useCatalog();

  return useMemo(() => {
    if (!catalog.data) return { isBundleComplete: false, categoryProgress: {} };
    const data = catalog.data;

    const categoryProgress = Object.fromEntries(
      data.categories.map(category => [category.id, selectCategoryProgress(state, data, category.id)])
    );

    return { isBundleComplete: selectIsBundleComplete(state, data), categoryProgress };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only selections affect completion
  }, [state.selections, catalog.data]);
}
