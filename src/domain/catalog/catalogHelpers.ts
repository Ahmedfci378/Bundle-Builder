import type { CatalogPayload, Product, Variant, ProductId, VariantId, CategoryId } from '../../types/catalog.types';

export function findProduct(catalog: CatalogPayload, productId: ProductId): Product | undefined {
  return catalog.products.find(p => p.id === productId);
}

export function findCategory(catalog: CatalogPayload, categoryId: CategoryId) {
  return catalog.categories.find(c => c.id === categoryId);
}

export function findVariant(product: Product, variantId?: VariantId): Variant | undefined {
  if (!product.hasVariants) return undefined;
  return product.variants.find(v => v.id === variantId) ?? product.variants.find(v => v.id === product.defaultVariantId);
}

/**
 * Resolves the current unit price for a product, taking the variant into
 * account when the product has variants. This is the ONLY function in the
 * app that reads `.price` off a Product/Variant — every selector and hook
 * calls this instead of re-implementing the hasVariants check.
 */
export function getEffectivePrice(product: Product, variantId?: VariantId): number {
  if (product.hasVariants) {
    return findVariant(product, variantId)?.price ?? 0;
  }
  return product.price;
}

export function getEffectiveCompareAtPrice(product: Product, variantId?: VariantId): number | undefined {
  if (product.hasVariants) {
    return findVariant(product, variantId)?.compareAtPrice;
  }
  return product.compareAtPrice;
}

/** Stock; `undefined` from a simple product with no `quantity` means unlimited. */
export function getEffectiveStock(product: Product, variantId?: VariantId): number | undefined {
  if (product.hasVariants) {
    return findVariant(product, variantId)?.quantity ?? 0;
  }
  return product.quantity;
}

export function getEffectiveImage(product: Product, variantId?: VariantId): string {
  if (product.hasVariants) {
    return findVariant(product, variantId)?.image ?? product.image;
  }
  return product.image;
}

export function isOutOfStock(product: Product, variantId?: VariantId): boolean {
  const stock = getEffectiveStock(product, variantId);
  return stock !== undefined && stock === 0;
}

export function isLowStock(product: Product, variantId: VariantId | undefined, threshold: number): boolean {
  const stock = getEffectiveStock(product, variantId);
  return stock !== undefined && stock > 0 && stock <= threshold;
}

export function getMaxSelectableQuantity(product: Product, variantId: VariantId | undefined, configMax: number): number {
  const stock = getEffectiveStock(product, variantId);
  return stock === undefined ? configMax : Math.min(stock, configMax);
}
