import type { BuilderState } from '../../types/builder.types';
import type { CatalogPayload, Product, Variant } from '../../types/catalog.types';
import type { SelectionEntry } from '../../types/builder.types';
import { findProduct, findVariant } from '../../domain/catalog/catalogHelpers';

/** The one place `Record<ProductId, SelectionEntry>` becomes an array. */
export function selectSelectedEntries(state: BuilderState): SelectionEntry[] {
  return Object.values(state.selections);
}

export function selectTotalItemCount(state: BuilderState): number {
  return selectSelectedEntries(state).reduce((sum, entry) => sum + entry.quantity, 0);
}

export interface ResolvedSelection {
  entry: SelectionEntry;
  product: Product;
  variant?: Variant;
}

/**
 * Joins every selection against the catalog once. The Review Panel and any
 * per-category "selected items" summary both read from this — the single
 * join point — rather than each re-implementing the product/variant lookup.
 */
export function selectSelectedProducts(state: BuilderState, catalog: CatalogPayload): ResolvedSelection[] {
  return selectSelectedEntries(state)
    .map((entry): ResolvedSelection | null => {
      const product = findProduct(catalog, entry.productId);
      if (!product) return null;
      const variant = product.hasVariants ? findVariant(product, entry.variantId) : undefined;
      return { entry, product, variant };
    })
    .filter((resolved): resolved is ResolvedSelection => resolved !== null);
}
