import { useCallback, useEffect, useMemo } from 'react';
import type { Dispatch } from 'react';
import type { BuilderState } from '../types/builder.types';
import type { BuilderAction } from '../context/builder/builderActions';
import { storageRepository } from '../services/storageRepository';

const AUTO_SAVE_DEBOUNCE_MS = 500;

export interface UsePersistedConfigurationOptions {
  /**
   * When true (the default), changes are written to localStorage
   * automatically, debounced, with no user-visible feedback. Pass false
   * for call sites that only need `saveNow` (e.g. a "Save for later"
   * button) so the same state change doesn't get written twice by two
   * independent debounce timers.
   */
  autoSave?: boolean;
  debounceMs?: number;
}

export interface UsePersistedConfigurationResult {
  /** Persists immediately (no debounce) and returns the payload that was written. */
  saveNow: () => void;
}

/**
 * The one hook responsible for turning BuilderState into "the complete
 * configuration" and getting it into localStorage — and back out again.
 *
 * Restoration is handled elsewhere (initBuilderState's lazy init, so it can
 * run synchronously before first paint and avoid any flash of empty state)
 * — but the SHAPE of what gets restored and what gets saved is defined in
 * exactly one place here, so the two can never drift out of sync with each
 * other.
 *
 * Called from two places for two different triggers, never duplicating the
 * underlying save logic:
 *  - BuilderProvider: `usePersistedConfiguration(state, dispatch)` — silent,
 *    debounced autosave on every relevant change.
 *  - The "Save my system for later" button: `usePersistedConfiguration(state,
 *    dispatch, { autoSave: false })` — just to get `saveNow`, with a toast.
 */
export function usePersistedConfiguration(
  state: BuilderState,
  dispatch: Dispatch<BuilderAction>,
  options: UsePersistedConfigurationOptions = {}
): UsePersistedConfigurationResult {
  const { autoSave = true, debounceMs = AUTO_SAVE_DEBOUNCE_MS } = options;

  // The single definition of "what constitutes the complete configuration."
  // Both saveNow and the autosave effect below build their payload here —
  // there is no second place this shape is assembled.
  const payload = useMemo(
    () => ({
      selections: Object.values(state.selections),
      expandedCategoryIds: state.expandedCategoryIds,
      selectedShippingMethodId: state.selectedShippingMethodId,
      activeConfigurationId: state.activeConfigurationId,
    }),
    [state.selections, state.expandedCategoryIds, state.selectedShippingMethodId, state.activeConfigurationId]
  );

  useEffect(() => {
    if (!autoSave) return;
    const timeoutId = window.setTimeout(() => {
      storageRepository.savePersistedConfiguration(payload);
    }, debounceMs);
    return () => window.clearTimeout(timeoutId);
  }, [autoSave, debounceMs, payload]);

  const saveNow = useCallback(() => {
    storageRepository.savePersistedConfiguration(payload);
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: 'Your system has been saved. Come back anytime to pick up where you left off.', variant: 'success' },
    });
  }, [dispatch, payload]);

  return { saveNow };
}
