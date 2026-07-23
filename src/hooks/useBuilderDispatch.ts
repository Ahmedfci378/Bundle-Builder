import { useContext } from 'react';
import type { Dispatch } from 'react';
import { BuilderDispatchContext } from '../context/builder/BuilderDispatchContext';
import type { BuilderAction } from '../context/builder/builderActions';

export function useBuilderDispatch(): Dispatch<BuilderAction> {
  const ctx = useContext(BuilderDispatchContext);
  if (!ctx) throw new Error('useBuilderDispatch must be used within a BuilderProvider');
  return ctx;
}
