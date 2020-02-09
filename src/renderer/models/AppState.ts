// contains the entire state of the application

// function loadMostRecentState(): Promise<AppState> {
// }

import { Env } from './Env';
import { Flow } from './http/flow';
import { Collection } from './Collection';

export interface AppState {
  readonly envList: Readonly<{ [key: string]: Env }>;
  readonly collections: Readonly<{ [key: string]: Collection }>;

  readonly currentEnv: Env | null;
  readonly currentProtoDefs: ReadonlyArray<File>;
  readonly currentMessageNames: ReadonlyArray<string>; // just the top-level ones
  readonly currentFlow: Flow | null;
}
