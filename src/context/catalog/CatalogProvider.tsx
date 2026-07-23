import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CatalogContext } from './CatalogContext';
import type { CatalogState } from './CatalogContext';
import { getCatalog } from '../../services/catalogService';

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>({ status: 'idle', error: null, data: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', error: null, data: null });

    getCatalog()
      .then(data => {
        if (!cancelled) setState({ status: 'success', error: null, data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load catalog';
          setState({ status: 'error', error: message, data: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}
