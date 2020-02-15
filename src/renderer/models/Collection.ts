import { Flow } from './http/flow';

export interface Collection {
  readonly protoDefs: ReadonlyArray<File>;
  readonly messageNames: ReadonlyArray<string>;
  readonly flows: ReadonlyArray<[string, Flow]>;
}
