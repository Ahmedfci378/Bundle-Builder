import type { ReactNode } from 'react';
import { CatalogProvider } from '../context/catalog/CatalogProvider';
import { BuilderProvider } from '../context/builder/BuilderProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CatalogProvider>
      <BuilderProvider>{children}</BuilderProvider>
    </CatalogProvider>
  );
}
