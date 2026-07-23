import { useEffect } from 'react';
import type { SavedConfiguration } from '../types/builder.types';
import { storageRepository } from '../services/storageRepository';

export function useSavedConfigurationsSync(savedConfigurations: SavedConfiguration[]): void {
  useEffect(() => {
    storageRepository.persistSavedConfigurations(savedConfigurations);
  }, [savedConfigurations]);
}
