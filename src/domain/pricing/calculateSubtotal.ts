import type { CatalogPayload } from '../../types/catalog.types';
import type { SelectionEntry } from '../../types/builder.types';
import { findProduct, getEffectivePrice, getEffectiveCompareAtPrice } from '../catalog/catalogHelpers';

/** Sum of actual unit price * quantity across every selection. */
export function calculateSubtotal(entries: SelectionEntry[], catalog: CatalogPayload): number {
  return entries.reduce((sum, entry) => {
    const product = findProduct(catalog, entry.productId);
    if (!product) return sum;
    return sum + getEffectivePrice(product, entry.variantId) * entry.quantity;
  }, 0);
}

/** Sum of (compareAtPrice ?? price) * quantity — the "full price" baseline used only to show markdown savings. */
export function calculateListSubtotal(entries: SelectionEntry[], catalog: CatalogPayload): number {
  return entries.reduce((sum, entry) => {
    const product = findProduct(catalog, entry.productId);
    if (!product) return sum;
    const price = getEffectivePrice(product, entry.variantId);
    const compareAtPrice = getEffectiveCompareAtPrice(product, entry.variantId);
    return sum + (compareAtPrice ?? price) * entry.quantity;
  }, 0);
}
