import { useCallback } from 'react';
import { useBuilderState } from './useBuilderState';
import { useBuilderDispatch } from './useBuilderDispatch';
import type { ToastMessage, ToastVariant } from '../types/builder.types';

export interface UseToastResult {
  toast: ToastMessage | null;
  show: (message: string, variant?: ToastVariant) => void;
  clear: () => void;
}

export function useToast(): UseToastResult {
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      dispatch({ type: 'SHOW_TOAST', payload: { message, variant } });
    },
    [dispatch]
  );

  const clear = useCallback(() => dispatch({ type: 'CLEAR_TOAST' }), [dispatch]);

  return { toast: state.ui.toast, show, clear };
}
