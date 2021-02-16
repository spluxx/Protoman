// contains the entire state of the application

import { Env } from './Env';
import { Collection } from './Collection';
import { Cache } from '../../core/Cache';

export interface AppState {
  readonly envList: ReadonlyArray<[string, Env]>;
  readonly currentEnv: string;
  readonly nodeEnvList: ReadonlyArray<string>;
  readonly currentNodeEnv: string;
  readonly currentCacheName: string;
  readonly caches: ReadonlyArray<[string, Cache]>;
  readonly collections: ReadonlyArray<[string, Collection]>;

  readonly openCollections: ReadonlyArray<string>;
  readonly fmOpenCollection: string | undefined;

  readonly currentCollection: string;
  readonly currentFlow: string;
}
