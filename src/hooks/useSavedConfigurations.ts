import { useCallback } from 'react';
import { useBuilderState } from './useBuilderState';
import { useBuilderDispatch } from './useBuilderDispatch';
import { useCatalog } from '../context/catalog/useCatalog';
import type { SavedConfiguration } from '../types/builder.types';
import { generateId } from '../services/idGenerator';
import { findProduct } from '../domain/catalog/catalogHelpers';

export interface UseSavedConfigurationsResult {
  configs: SavedConfiguration[];
  save: (name: string) => void;
  load: (id: string) => void;
  remove: (id: string) => void;
}

export function useSavedConfigurations(): UseSavedConfigurationsResult {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const catalog = useCatalog();

  const save = useCallback(
    (name: string) => {
      dispatch({
        type: 'SAVE_CONFIGURATION',
        payload: { id: generateId(), name, createdAt: new Date().toISOString() },
      });
    },
    [dispatch]
  );

  const load = useCallback(
    (id: string) => {
      const config = state.savedConfigurations.find(c => c.id === id);
      if (!config || !catalog.data) return;

      const expandedCategoryIds = [
        ...new Set(
          config.selections
            .map(s => findProduct(catalog.data!, s.productId)?.categoryId)
            .filter((categoryId): categoryId is string => Boolean(categoryId))
        ),
      ];

      dispatch({
        type: 'LOAD_CONFIGURATION',
        payload: {
          id: config.id,
          selections: config.selections,
          shippingMethodId: config.shippingMethodId,
          name: config.name,
          expandedCategoryIds,
        },
      });
    },
    [dispatch, state.savedConfigurations, catalog.data]
  );

  const remove = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_CONFIGURATION', payload: { id } });
    },
    [dispatch]
  );

  return { configs: state.savedConfigurations, save, load, remove };
}
