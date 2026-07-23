import { createContext } from 'react';
import type { CatalogPayload } from '../../types/catalog.types';

export type CatalogStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CatalogState {
  status: CatalogStatus;
  error: string | null;
  data: CatalogPayload | null;
}

export const CatalogContext = createContext<CatalogState | undefined>(undefined);
