import type { PersistedConfiguration, SavedConfiguration } from '../types/builder.types';

const SAVED_SYSTEM_KEY = 'bundle-builder:saved-system';
const SAVED_CONFIGS_KEY = 'bundle-builder:saved-configurations';

function safeRead<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // Corrupt or inaccessible storage should never crash the app — treat as absent.
    return null;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full/unavailable (e.g. private browsing) — fail silently; the
    // in-memory reducer state remains correct for the rest of the session.
  }
}

/**
 * Components and hooks never touch localStorage directly — only this
 * module does. Swapping either mechanism for a backend endpoint later is a
 * change confined to this one file.
 *
 * Two independent persistence concerns, two key namespaces:
 *  - "saved system": the ONE current in-progress configuration (what "Save
 *    my system for later" writes, and what auto-restores on reload).
 *  - "saved configurations": a user-curated LIST of named bundles, a
 *    separate feature with its own save/load/delete UX.
 * They're kept apart because they have different shapes, different write
 * triggers, and conflating them would make either feature harder to reason
 * about in isolation.
 */
export const storageRepository = {
  loadPersistedConfiguration(): PersistedConfiguration | null {
    return safeRead<PersistedConfiguration>(SAVED_SYSTEM_KEY);
  },
  savePersistedConfiguration(config: PersistedConfiguration): void {
    safeWrite(SAVED_SYSTEM_KEY, config);
  },
  clearPersistedConfiguration(): void {
    try {
      window.localStorage.removeItem(SAVED_SYSTEM_KEY);
    } catch {
      // no-op — nothing to clean up if storage is unavailable
    }
  },
  loadSavedConfigurations(): SavedConfiguration[] {
    return safeRead<SavedConfiguration[]>(SAVED_CONFIGS_KEY) ?? [];
  },
  persistSavedConfigurations(configs: SavedConfiguration[]): void {
    safeWrite(SAVED_CONFIGS_KEY, configs);
  },
};
