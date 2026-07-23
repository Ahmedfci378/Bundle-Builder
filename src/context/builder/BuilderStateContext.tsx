import { createContext } from 'react';
import type { BuilderState } from '../../types/builder.types';

export const BuilderStateContext = createContext<BuilderState | undefined>(undefined);
