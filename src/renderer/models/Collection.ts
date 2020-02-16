import { Flow } from './http/flow';
import { ProtoCtx } from './http/body/protobuf';

export interface Collection {
  readonly protoDefs: ReadonlyArray<File>;
  readonly protoCtx: ProtoCtx;
  readonly messageNames: ReadonlyArray<string>;
  readonly flows: ReadonlyArray<[string, Flow]>;
}
