import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../models/AppState';
import { AnyAction } from 'redux';
import { queryCache, registerCache } from '../../events';
import { CacheQueryResponse, CacheRequestBuilder } from '../../../core/cache';
import { ProtoCtx } from '../../../core/protobuf/protobuf';
import { getByKey } from '../../utils/utils';
const SEND_QUERY_CACHE_REQUEST = 'SEND_QUERY_CACHE_REQUEST';
const REGISTER_CACHE = 'REGISTER_CACHE';
const REGISTER_CACHE_RESPONSE = 'REGISTER_CACHE_RESPONSE';
const REGISTER_CACHE_ERROR = 'REGISTER_CACHE_ERROR';
const SET_QUERY_CACHE_RESPONSE = 'SET_QUERY_CACHE_RESPONSE';
const SET_CACHE_REQUEST_ERROR = 'SET_CACHE_REQUEST_ERROR';
const SET_CACHE_NAME = 'SET_CACHE_NAME';
const SELECT_QUERY_MESSAGE_NAME = 'SELECT_QUERY_MESSAGE_NAME';
type LoadCacheAction = {
  type:
    | 'QUERY_CACHE_SUCCESS'
    | 'REGISTER_CACHE'
    | 'QUERY_CACHE'
    | 'SET_CACHE_NAME'
    | 'SEND_QUERY_CACHE_REQUEST'
    | 'SET_QUERY_CACHE_RESPONSE'
    | 'SET_CACHE_REQUEST_ERROR';
  value: { [key: string]: any };
};
type SendQueryCacheRequest = {
  type: 'SEND_QUERY_CACHE_REQUEST';
  nodeEnv: string;
  cacheName: string;
  request: CacheRequestBuilder;
};

type SetCacheResponse = {
  type: 'SET_QUERY_CACHE_RESPONSE';
  nodeEnv: string;
  cacheName: string;
  response: CacheQueryResponse;
};

type SetCacheRequestError = {
  type: 'SET_CACHE_REQUEST_ERROR';
  err: Error;
};

type SelectQueryMessageName = {
  type: 'SELECT_QUERY_MESSAGE_NAME';
  name: string;
};

type SetCacheName = {
  type: 'SET_CACHE_NAME';
  cacheName: 'Common' | 'Demand' | 'Supply' | undefined;
};

type RegisterCache = {
  type: 'REGISTER_CACHE';
  nodeEnv: string;
  cacheName: string;
  protoCtx: ProtoCtx;
};

type RegisterCacheResponse = {
  type: 'REGISTER_CACHE_RESPONSE';
  nodeEnv: string;
  cacheName: string;
  protoCtx: ProtoCtx;
};

export const CacheActionTypes = [
  REGISTER_CACHE,
  REGISTER_CACHE_RESPONSE,
  REGISTER_CACHE_ERROR,
  SELECT_QUERY_MESSAGE_NAME,
  SET_CACHE_NAME,
  SEND_QUERY_CACHE_REQUEST,
  SET_QUERY_CACHE_RESPONSE,
  SET_CACHE_REQUEST_ERROR,
];
export type CacheAction =
  | RegisterCache
  | RegisterCacheResponse
  | SendQueryCacheRequest
  | SetCacheResponse
  | SetCacheName
  | SelectQueryMessageName
  | SetCacheRequestError;

export function queryCacheAction(
  nodeEnv: string,
  cacheName: string,
  request: CacheRequestBuilder,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: SEND_QUERY_CACHE_REQUEST, nodeEnv, cacheName, request });
    try {
      const response = await queryCache(nodeEnv, cacheName, request);
      dispatch({ type: SET_QUERY_CACHE_RESPONSE, nodeEnv, cacheName, response });
    } catch (err) {
      dispatch({ type: SET_CACHE_REQUEST_ERROR, cacheName, err });
    }
  };
}

export function selectQueryMessageName(name: string): SelectQueryMessageName {
  return {
    type: SELECT_QUERY_MESSAGE_NAME,
    name,
  };
}

export function registerCacheAction(
  nodeEnv: string,
  cacheName: 'Common' | 'Demand' | 'Supply' | undefined,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: REGISTER_CACHE, cacheName });
    try {
      const protoCtx = await registerCache(nodeEnv, cacheName);
      dispatch({ type: REGISTER_CACHE_RESPONSE, nodeEnv, cacheName, protoCtx });
    } catch (err) {
      dispatch({ type: SET_CACHE_REQUEST_ERROR, nodeEnv, cacheName, err });
    }
  };
}

export function selectCacheName(
  nodeEnv: string,
  cacheName: 'Common' | 'Demand' | 'Supply' | undefined,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch, getState): Promise<void> => {
    const s = getState();
    if (!getByKey(s.cache.protoCtxs, cacheName)) {
      await dispatch(registerCacheAction(nodeEnv, cacheName));
    }
    dispatch({ type: SET_CACHE_NAME, cacheName });
  };
}
