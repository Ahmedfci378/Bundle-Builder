import { useCallback, useMemo } from 'react';
import { useCatalog } from '../../context/catalog/useCatalog';
import { useSelection } from '../../hooks/useSelection';
import { useBuilderDispatch } from '../../hooks/useBuilderDispatch';
import { ProductCard } from './ProductCard';
import type { Product, ProductId, SelectionMode } from '../../types/catalog.types';
import {
  getEffectivePrice,
  getEffectiveCompareAtPrice,
  getEffectiveImage,
  findVariant,
} from '../../domain/catalog/catalogHelpers';
import { selectIsOutOfStock, selectIsLowStock } from '../../state/selectors/stockSelectors';

export interface ProductCardContainerProps {
  product: Product;
  selectionMode: SelectionMode;
  /** Other product ids in the same category — cleared automatically when selectionMode is 'single'. */
  siblingProductIds: ProductId[];
  /** Forwarded straight to ProductCard. Defaults to 'default' for every category except Cameras. */
  layout?: 'default' | 'camera';
}

/**
 * Resolves one catalog Product + its selection state into the flat
 * view-model ProductCard expects. Two things here matter for ProductCard's
 * React.memo to actually pay off: `variantOptions` and `handleQuantityChange`
 * must keep stable identities across renders that don't concern THIS
 * product, otherwise memo's shallow prop comparison would see "changed"
 * array/function references every time and never bail out.
 */
export function ProductCardContainer({
  product,
  selectionMode,
  siblingProductIds,
  layout = 'default',
}: ProductCardContainerProps) {
  const catalog = useCatalog();
  const dispatch = useBuilderDispatch();
  const { entry, selectedVariantId, maxQuantity, setVariant, setQuantity } = useSelection(product.id);

  // `product.variants` never changes after catalog load, so this only needs
  // to be recomputed if the product itself changes — not on every render.
  const variantOptions = useMemo(
    () =>
      product.hasVariants
        ? product.variants.map(variant => ({
            id: variant.id,
            label: variant.name,
            image: variant.image,
            swatch: variant.swatch,
            disabled: variant.quantity === 0,
          }))
        : undefined,
    [product]
  );

  const handleQuantityChange = useCallback(
    (nextQuantity: number) => {
      if (selectionMode === 'single' && nextQuantity > 0) {
        // Enforce "only one product selected in this category" before applying the new selection.
        siblingProductIds.forEach(siblingId => dispatch({ type: 'REMOVE_PRODUCT', payload: { productId: siblingId } }));
      }
      setQuantity(nextQuantity);
    },
    [selectionMode, siblingProductIds, dispatch, setQuantity]
  );

  if (!catalog.data) return null;

  const quantity = entry?.quantity ?? 0;
  const price = getEffectivePrice(product, selectedVariantId);
  const compareAtPrice = getEffectiveCompareAtPrice(product, selectedVariantId);
  const outOfStock = selectIsOutOfStock(product, selectedVariantId);
  const lowStock = selectIsLowStock(catalog.data, product, selectedVariantId);
  const effectiveMaxQuantity = selectionMode === 'single' ? 1 : maxQuantity;
  const remainingStock = product.hasVariants ? findVariant(product, selectedVariantId)?.quantity : product.quantity;

  return (
    <ProductCard
      productId={product.id}
      name={product.name}
      description={product.description}
      image={getEffectiveImage(product, selectedVariantId)}
      badge={product.badge}
      learnMoreUrl={product.learnMore?.url}
      learnMoreLabel={product.learnMore?.label ?? catalog.data.config.defaultLearnMoreLabel}
      variants={variantOptions}
      selectedVariantId={selectedVariantId}
      onVariantChange={setVariant}
      price={price}
      compareAtPrice={compareAtPrice}
      quantity={quantity}
      maxQuantity={effectiveMaxQuantity}
      onQuantityChange={handleQuantityChange}
      isOutOfStock={outOfStock}
      isLowStock={lowStock}
      lowStockLabel={`Only ${remainingStock} left`}
      isSelected={quantity > 0}
      layout={layout}
    />
  );
}
