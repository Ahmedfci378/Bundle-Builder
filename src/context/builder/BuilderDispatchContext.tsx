import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { BuilderAction } from './builderActions';

export const BuilderDispatchContext = createContext<Dispatch<BuilderAction> | undefined>(undefined);
