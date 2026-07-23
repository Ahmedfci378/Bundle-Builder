import type { CatalogPayload } from '../types/catalog.types';
import catalogJson from '../data/bundle-catalog.json';

/**
 * Loads the catalog. Today this resolves a local JSON import; wrapped in a
 * Promise and an async function so switching to `fetch('/api/catalog')`
 * later requires changing only this function's body — every caller
 * (CatalogProvider) already awaits it and handles loading/error states.
 */
export async function getCatalog(): Promise<CatalogPayload> {
  // Simulated network latency so loading states are visibly exercised in dev.
  await new Promise(resolve => setTimeout(resolve, 150));
  return catalogJson as CatalogPayload;
}
