/* eslint-disable @typescript-eslint/no-use-before-define */
import { ProtoCtx } from './protobuf/protobuf';
export interface Cache {
  readonly currentCacheName: 'Common' | 'Demand' | 'Supply' | undefined;
  readonly protoCtxs: ReadonlyArray<[string, ProtoCtx]>;
  readonly requestBuilder: CacheRequestBuilder;
  readonly requestStatus: 'default' | 'sending' | 'success' | 'failure';
  readonly requestError: Error | undefined;
  readonly response: CacheQueryResponse | undefined;
}

export type CacheQueryResponse = {
  readonly protoCtx: ProtoCtx;
  readonly data: { [key: string]: any };
};

export type CacheRequestBuilder = {
  search: { [key: string]: any };
  limit?: number;
  expectedMessage: string;
};
