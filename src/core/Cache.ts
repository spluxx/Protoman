import { ProtoCtx } from './protobuf/protobuf';

export interface Cache {
  readonly protoCtx: ProtoCtx | undefined;
  readonly messageNames: ReadonlyArray<string>;
  readonly requestBuilder: CacheRequestBuilder;
  readonly requestStatus: 'default' | 'sending' | 'success' | 'failure';
  readonly requestError: Error | undefined;
  readonly cacheRecency: Date | undefined;
  readonly responseDescriptor: CacheResponseDescriptor | undefined;
}

export interface CacheQueryResponse {
  readonly protoCtx: ProtoCtx;
  readonly data: { [key: string]: any };
  readonly cacheRecency: Date;
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
