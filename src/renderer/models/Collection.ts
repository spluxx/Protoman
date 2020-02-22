import { Flow } from './http/flow';
import { ProtoCtx } from './http/body/protobuf';

export interface Collection {
  readonly protoFilepaths: ReadonlyArray<string>;
  readonly buildStatus: 'default' | 'building' | 'success' | 'failure';
  readonly buildError: Error | undefined;
  readonly protoCtx: ProtoCtx;
  readonly messageNames: ReadonlyArray<string>;
  readonly flows: ReadonlyArray<[string, Flow]>;
}
