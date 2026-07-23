import type { CatalogPayload, Product, VariantId } from '../../types/catalog.types';
import { getEffectiveStock, isOutOfStock as computeIsOutOfStock, isLowStock as computeIsLowStock } from '../../domain/catalog/catalogHelpers';

export function selectVariantStock(product: Product, variantId?: VariantId): number | undefined {
  return getEffectiveStock(product, variantId);
}

export function selectIsOutOfStock(product: Product, variantId?: VariantId): boolean {
  return computeIsOutOfStock(product, variantId);
}

export function selectIsLowStock(catalog: CatalogPayload, product: Product, variantId?: VariantId): boolean {
  return computeIsLowStock(product, variantId, catalog.config.lowStockThreshold);
}
