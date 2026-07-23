import { useMemo } from 'react';
import { useBuilderState } from '../../hooks/useBuilderState';
import { useBuilderDispatch } from '../../hooks/useBuilderDispatch';
import { useCatalog } from '../../context/catalog/useCatalog';
import { usePricing } from '../../hooks/usePricing';
import { useShipping } from '../../hooks/useShipping';
import { useBundleCompletion } from '../../hooks/useBundleCompletion';
import { usePersistedConfiguration } from '../../hooks/usePersistedConfiguration';
import { selectSelectedProducts } from '../../state/selectors/selectionSelectors';
import { ReviewPanel } from './ReviewPanel';
import type { ReviewGroup, ReviewPanelLayout } from './ReviewPanel';
import { getEffectivePrice, getEffectiveCompareAtPrice, getEffectiveImage } from '../../domain/catalog/catalogHelpers';

export interface ReviewPanelContainerProps {
  layout: ReviewPanelLayout;
}

export function ReviewPanelContainer({ layout }: ReviewPanelContainerProps) {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const catalog = useCatalog();
  const pricing = usePricing();
  const shipping = useShipping();
  const { isBundleComplete } = useBundleCompletion();
  // autoSave: false — the provider's own usePersistedConfiguration call already
  // handles silent autosave; this call site only needs `saveNow` for the button.
  const { saveNow } = usePersistedConfiguration(state, dispatch, { autoSave: false });

  const groups: ReviewGroup[] = useMemo(() => {
    if (!catalog.data) return [];
    const data = catalog.data;
    const resolved = selectSelectedProducts(state, data);

    return [...data.categories]
      .sort((a, b) => a.order - b.order)
      .map(category => ({
        categoryId: category.id,
        categoryName: category.name,
        items: resolved
          .filter(r => r.product.categoryId === category.id)
          .map(({ entry, product, variant }) => ({
            productId: product.id,
            image: getEffectiveImage(product, variant?.id),
            name: product.name,
            variantLabel: variant?.name,
            price: getEffectivePrice(product, variant?.id),
            compareAtPrice: getEffectiveCompareAtPrice(product, variant?.id),
            quantity: entry.quantity,
            maxQuantity: data.config.maxQuantityPerVariant,
            editable: true,
            onQuantityChange: (quantity: number) =>
              dispatch({ type: 'SET_QUANTITY', payload: { productId: product.id, quantity } }),
            onRemove: () => dispatch({ type: 'REMOVE_PRODUCT', payload: { productId: product.id } }),
          })),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only selections affect grouped items
  }, [state.selections, catalog.data, dispatch]);

  const activeShippingMethod = shipping.methods.find(m => m.id === shipping.effectiveMethodId);

  return (
    <ReviewPanel
      title="Your security system"
      description="Review your personalized protection system designed to keep what matters most safe."
      layout={layout}
      groups={groups}
      shippingLine={
        activeShippingMethod
          ? {
              productId: '__shipping__',
              icon: 'truck',
              name: activeShippingMethod.label,
              price: pricing.shippingCost,
              compareAtPrice: pricing.shippingCost === 0 ? activeShippingMethod.cost : undefined,
              freeLabel: pricing.shippingCost === 0 ? 'FREE' : undefined,
              quantity: 1,
              editable: false,
            }
          : undefined
      }
      summary={{
        listTotal: pricing.listSubtotal,
        total: pricing.grandTotal,
        savingsAmount: pricing.totalSavings,
        savingsPercentage: pricing.savingsPercentage,
        financingText: undefined,
        onCheckout: () => dispatch({ type: 'SHOW_TOAST', payload: { message: 'Checkout is not implemented in this demo.', variant: 'info' } }),
        onSaveForLater: saveNow,
        isCheckoutDisabled: !isBundleComplete,
      }}
      emptyState={<p className="text-body-secondary small">Add products to see your bundle here.</p>}
    />
  );
}
