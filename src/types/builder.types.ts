import type { ProductId, VariantId, ShippingMethodId, CategoryId } from './catalog.types';

export interface SelectionEntry {
  productId: ProductId;
  variantId: VariantId;
  quantity: number;
}

export type ToastVariant = 'success' | 'info' | 'danger';
export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  createdAt: string;
  selections: SelectionEntry[];
  shippingMethodId: ShippingMethodId | null;
}

export interface BuilderUiState {
  isSaveModalOpen: boolean;
  isSavedConfigsOpen: boolean;
  toast: ToastMessage | null;
}

export interface BuilderState {
  selections: Record<ProductId, SelectionEntry>;
  expandedCategoryIds: CategoryId[];
  selectedShippingMethodId: ShippingMethodId | null;
  activeConfigurationId: string | null;
  savedConfigurations: SavedConfiguration[];
  ui: BuilderUiState;
}

/**
 * Everything needed to restore the builder to exactly how the user left
 * it — the payload behind "Save my system for later" and the silent
 * autosave that back it up continuously. Distinct from the named
 * SavedConfiguration list: this is the single current session's state,
 * not a user-curated list of bundles.
 */
export interface PersistedConfiguration {
  selections: SelectionEntry[];
  expandedCategoryIds: CategoryId[];
  selectedShippingMethodId: ShippingMethodId | null;
  activeConfigurationId: string | null;
}
