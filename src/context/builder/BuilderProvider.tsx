import { useReducer } from 'react';
import type { ReactNode } from 'react';
import { BuilderStateContext } from './BuilderStateContext';
import { BuilderDispatchContext } from './BuilderDispatchContext';
import { builderReducer } from './builderReducer';
import { initBuilderState } from './initialBuilderState';
import { usePersistedConfiguration } from '../../hooks/usePersistedConfiguration';
import { useSavedConfigurationsSync } from '../../hooks/useSavedConfigurationsSync';

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, undefined, initBuilderState);

  // Silent, debounced autosave — the safety net so a refresh never loses
  // in-progress work, independent of the user ever clicking "Save for later."
  usePersistedConfiguration(state, dispatch);
  useSavedConfigurationsSync(state.savedConfigurations);

  return (
    <BuilderDispatchContext.Provider value={dispatch}>
      <BuilderStateContext.Provider value={state}>{children}</BuilderStateContext.Provider>
    </BuilderDispatchContext.Provider>
  );
}
