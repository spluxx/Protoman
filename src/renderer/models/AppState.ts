// contains the entire state of the application

// function loadMostRecentState(): Promise<AppState> {
// }

import { Env } from './Env';
import { Flow } from './http/flow';
import { Collection } from './Collection';

export interface AppState {
  readonly envList: ReadonlyArray<[string, Env]>;
  readonly collections: ReadonlyArray<[string, Collection]>;

  readonly currentEnv: string | null;
  readonly currentProtoDefs: ReadonlyArray<File>;
  readonly currentMessageNames: ReadonlyArray<string>; // just the top-level ones
  readonly currentFlow: Flow;
}
