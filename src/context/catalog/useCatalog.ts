import { useContext } from 'react';
import { CatalogContext } from './CatalogContext';
import type { CatalogState } from './CatalogContext';

export function useCatalog(): CatalogState {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider');
  return ctx;
}
