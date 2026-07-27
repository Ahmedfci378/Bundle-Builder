import type { BuilderState, SavedConfiguration } from '../../types/builder.types';
import type { BuilderAction } from './builderActions';
import { assertNever } from '../../utils/assertNever';
import { generateId } from '../../services/idGenerator';

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_VARIANT': {
      const { productId, variantId } = action.payload;
      const existing = state.selections[productId];
      return {
        ...state,
        selections: {
          ...state.selections,
          [productId]: { productId, variantId, quantity: existing?.quantity ?? 1 },
        },
      };
    }

    case 'SET_QUANTITY': {
  const { productId, quantity } = action.payload;

  if (quantity <= 0) {
    const next = { ...state.selections };
    delete next[productId];
    return { ...state, selections: next };
  }

  const existing = state.selections[productId];

  return {
    ...state,
    selections: {
      ...state.selections,
      [productId]: existing
        ? {
            ...existing,
            quantity,
          }
        : {
            productId,
            variantId: '',
            quantity,
          },
    },
  };
}

    case 'REMOVE_PRODUCT': {
      const next = { ...state.selections };
      delete next[action.payload.productId];
      return { ...state, selections: next };
    }

    case 'TOGGLE_ACCORDION_SECTION': {
      const { categoryId } = action.payload;
      const isOpen = state.expandedCategoryIds.includes(categoryId);
      return {
        ...state,
        expandedCategoryIds: isOpen
          ? state.expandedCategoryIds.filter(id => id !== categoryId)
          : [...state.expandedCategoryIds, categoryId],
      };
    }

    case 'SET_EXPANDED_SECTIONS':
      return { ...state, expandedCategoryIds: action.payload.categoryIds };

    case 'SET_SHIPPING_METHOD':
      return { ...state, selectedShippingMethodId: action.payload.methodId };

    case 'OPEN_SAVE_MODAL':
      return { ...state, ui: { ...state.ui, isSaveModalOpen: true } };

    case 'CLOSE_SAVE_MODAL':
      return { ...state, ui: { ...state.ui, isSaveModalOpen: false } };

    case 'SAVE_CONFIGURATION': {
      const { id, name, createdAt } = action.payload;
      const snapshot: SavedConfiguration = {
        id,
        name,
        createdAt,
        selections: Object.values(state.selections),
        shippingMethodId: state.selectedShippingMethodId,
      };
      return {
        ...state,
        savedConfigurations: [...state.savedConfigurations, snapshot],
        activeConfigurationId: id,
        ui: {
          ...state.ui,
          isSaveModalOpen: false,
          toast: { id: generateId(), message: `Saved "${name}"`, variant: 'success' },
        },
      };
    }

    case 'LOAD_CONFIGURATION': {
      const { id, selections, shippingMethodId, name, expandedCategoryIds } = action.payload;
      return {
        ...state,
        selections: Object.fromEntries(selections.map(s => [s.productId, s])),
        selectedShippingMethodId: shippingMethodId,
        activeConfigurationId: id,
        expandedCategoryIds,
        ui: {
          ...state.ui,
          isSavedConfigsOpen: false,
          toast: { id: generateId(), message: `Loaded "${name}"`, variant: 'success' },
        },
      };
    }

    case 'DELETE_CONFIGURATION': {
      const remaining = state.savedConfigurations.filter(c => c.id !== action.payload.id);
      return {
        ...state,
        savedConfigurations: remaining,
        activeConfigurationId:
          state.activeConfigurationId === action.payload.id ? null : state.activeConfigurationId,
      };
    }

    case 'OPEN_SAVED_CONFIGS':
      return { ...state, ui: { ...state.ui, isSavedConfigsOpen: true } };

    case 'CLOSE_SAVED_CONFIGS':
      return { ...state, ui: { ...state.ui, isSavedConfigsOpen: false } };

    case 'SHOW_TOAST':
      return { ...state, ui: { ...state.ui, toast: { id: generateId(), ...action.payload } } };

    case 'CLEAR_TOAST':
      return { ...state, ui: { ...state.ui, toast: null } };

    default:
      return assertNever(action);
  }
}
