// contains the entire state of the application

import { Env } from './Env';
import { Collection } from './Collection';
import { CacheData } from '../../core/protobuf/protobuf';

export interface AppState {
  readonly envList: ReadonlyArray<[string, Env]>;
  readonly currentEnv: string;
  readonly cache: CacheData;
  readonly collections: ReadonlyArray<[string, Collection]>;

  readonly openCollections: ReadonlyArray<string>;
  readonly fmOpenCollection: string | undefined;

  readonly currentCollection: string;
  readonly currentFlow: string;
}
