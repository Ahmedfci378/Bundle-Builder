import type { BuilderState } from '../../types/builder.types';
import { storageRepository } from '../../services/storageRepository';

/**
 * Runs synchronously as useReducer's lazy-init argument — restoration
 * happens BEFORE first paint, so a reloaded page shows the user's saved
 * system immediately with no flash of an empty builder. This is the only
 * place restoration logic lives; the persistence hook (usePersistedConfiguration)
 * only ever WRITES, never reads, so there is exactly one code path that
 * interprets a PersistedConfiguration back into BuilderState.
 */
export function initBuilderState(): BuilderState {
  const saved = storageRepository.loadPersistedConfiguration();
  const savedConfigurations = storageRepository.loadSavedConfigurations();

  return {
    selections: saved ? Object.fromEntries(saved.selections.map(s => [s.productId, s])) : {},
    expandedCategoryIds: saved?.expandedCategoryIds ?? [],
    selectedShippingMethodId: saved?.selectedShippingMethodId ?? null,
    activeConfigurationId: saved?.activeConfigurationId ?? null,
    savedConfigurations,
    ui: { isSaveModalOpen: false, isSavedConfigsOpen: false, toast: null },
  };
}
