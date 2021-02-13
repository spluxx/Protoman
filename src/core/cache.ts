/* eslint-disable @typescript-eslint/no-use-before-define */
import { ProtoCtx } from './protobuf/protobuf';
export interface Cache {
  readonly currentCacheName: 'Common' | 'Demand' | 'Supply' | undefined;
  readonly protoCtxs: ReadonlyArray<[string, ProtoCtx]>;
  readonly requestBuilder: CacheRequestBuilder;
  readonly requestStatus: 'default' | 'sending' | 'success' | 'failure';
  readonly requestError: Error | undefined;
  readonly responseDescriptor: CacheResponseDescriptor | undefined;
}

export type CacheQueryResponse = {
  readonly protoCtx: ProtoCtx;
  readonly data: { [key: string]: any };
};

export type CacheResponseDescriptor = {
  readonly response: CacheQueryResponse;
  readonly time: number;
};

export type CacheRequestBuilder = {
  search: { [key: string]: any };
  limit?: number;
  expectedMessage: string;
};
