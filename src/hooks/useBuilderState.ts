import { useContext } from 'react';
import { BuilderStateContext } from '../context/builder/BuilderStateContext';
import type { BuilderState } from '../types/builder.types';

export function useBuilderState(): BuilderState {
  const ctx = useContext(BuilderStateContext);
  if (!ctx) throw new Error('useBuilderState must be used within a BuilderProvider');
  return ctx;
}
