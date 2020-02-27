// contains the entire state of the application

// function loadMostRecentState(): Promise<AppState> {
// }

import { Env } from './Env';
import { Collection } from './Collection';

export interface AppState {
  readonly envList: ReadonlyArray<[string, Env]>;
  readonly currentEnv: string;

  readonly collections: ReadonlyArray<[string, Collection]>;

  readonly openCollections: ReadonlyArray<string>;
  readonly fmOpenCollection: string | undefined;

  readonly currentCollection: string;
  readonly currentFlow: string;
}
