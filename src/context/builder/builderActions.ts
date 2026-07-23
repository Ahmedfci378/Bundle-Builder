import type { CategoryId, ProductId, VariantId, ShippingMethodId } from '../../types/catalog.types';
import type { SelectionEntry, ToastVariant } from '../../types/builder.types';

export type BuilderAction =
  // Selections
  | { type: 'SET_VARIANT'; payload: { productId: ProductId; variantId: VariantId } }
  | { type: 'SET_QUANTITY'; payload: { productId: ProductId; quantity: number } }
  | { type: 'REMOVE_PRODUCT'; payload: { productId: ProductId } }

  // Accordion
  | { type: 'TOGGLE_ACCORDION_SECTION'; payload: { categoryId: CategoryId } }
  | { type: 'SET_EXPANDED_SECTIONS'; payload: { categoryIds: CategoryId[] } }

  // Shipping
  | { type: 'SET_SHIPPING_METHOD'; payload: { methodId: ShippingMethodId } }

  // Saved configurations
  | { type: 'OPEN_SAVE_MODAL' }
  | { type: 'CLOSE_SAVE_MODAL' }
  | {
      type: 'SAVE_CONFIGURATION';
      payload: { id: string; name: string; createdAt: string };
    }
  | {
      type: 'LOAD_CONFIGURATION';
      payload: {
        id: string;
        selections: SelectionEntry[];
        shippingMethodId: ShippingMethodId | null;
        name: string;
        expandedCategoryIds: CategoryId[];
      };
    }
  | { type: 'DELETE_CONFIGURATION'; payload: { id: string } }
  | { type: 'OPEN_SAVED_CONFIGS' }
  | { type: 'CLOSE_SAVED_CONFIGS' }

  // Feedback
  | { type: 'SHOW_TOAST'; payload: { message: string; variant: ToastVariant } }
  | { type: 'CLEAR_TOAST' };
