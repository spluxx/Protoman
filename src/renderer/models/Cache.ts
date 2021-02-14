import { ProtoCtx } from '../../core/protobuf/protobuf';

export interface Cache {
  readonly protoCtx: ProtoCtx | undefined;
  readonly messageNames: ReadonlyArray<string>;
  readonly requestBuilder: CacheRequestBuilder;
  readonly requestStatus: 'default' | 'sending' | 'success' | 'failure';
  readonly requestError: Error | undefined;
  readonly responseDescriptor: CacheResponseDescriptor | undefined;
}

export interface CacheQueryResponse {
  readonly protoCtx: ProtoCtx;
  readonly data: { [key: string]: any };
}

export interface CacheResponseDescriptor {
  readonly response: CacheQueryResponse;
  readonly time: number;
}

export interface CacheRequestBuilder {
  search: { [key: string]: any };
  limit?: number;
  expectedMessage: string;
}
