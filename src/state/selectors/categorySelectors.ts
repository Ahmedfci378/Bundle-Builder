import type { BuilderState } from '../../types/builder.types';
import type { CatalogPayload, CategoryId } from '../../types/catalog.types';
import { findProduct } from '../../domain/catalog/catalogHelpers';
import { selectSelectedEntries } from './selectionSelectors';

export interface CategoryProgress {
  selectedQuantity: number;
  isSatisfied: boolean;
}

export function selectCategoryProgress(
  state: BuilderState,
  catalog: CatalogPayload,
  categoryId: CategoryId
): CategoryProgress {
  const category = catalog.categories.find(c => c.id === categoryId);
  if (!category) return { selectedQuantity: 0, isSatisfied: true };

  const selectedQuantity = selectSelectedEntries(state).reduce((sum, entry) => {
    const product = findProduct(catalog, entry.productId);
    return product?.categoryId === categoryId ? sum + entry.quantity : sum;
  }, 0);

  const isSatisfied = !category.required || selectedQuantity >= category.minSelectedQuantity;
  return { selectedQuantity, isSatisfied };
}

/** Drives the global "Save configuration" / checkout CTA — true only once every required category is satisfied. */
export function selectIsBundleComplete(state: BuilderState, catalog: CatalogPayload): boolean {
  return catalog.categories.every(
    category => selectCategoryProgress(state, catalog, category.id).isSatisfied
  );
}
