import _ from 'lodash';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../models/AppState';
import { AnyAction } from 'redux';
import { queryCache, registerCache, refreshCache } from '../../events';
import { CacheRequestBuilder, CacheResponseDescriptor } from '../../../core/Cache';
import { ProtoCtx } from '../../../core/protobuf/protobuf';
import { getByKey } from '../../utils/utils';
const SEND_QUERY_CACHE_REQUEST = 'SEND_QUERY_CACHE_REQUEST';
const REGISTER_CACHE = 'REGISTER_CACHE';
const REFRESH_CACHE = 'REFRESH_CACHE';
const REFRESH_CACHE_ERROR = 'REFRESH_CACHE_ERROR';
const REFRESH_CACHE_RESPONSE = 'REFRESH_CACHE_RESPONSE';
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
    | 'REFRESH_CACHE'
    | 'REFRESH_CACHE_ERROR'
    | 'REFRESH_CACHE_RESPONSE'
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
  responseDescriptor: CacheResponseDescriptor;
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
  cacheName: string;
};

type RefreshCacheResponse = {
  type: 'REFRESH_CACHE_RESPONSE';
  nodeEnv: string;
  cacheName: string;
  time: Date;
};

type RefreshCache = {
  type: 'REFRESH_CACHE';
  nodeEnv: string;
  cacheName: string;
};
type RegisterCache = {
  type: 'REGISTER_CACHE';
  nodeEnv: string;
  cacheName: string;
};

type RegisterCacheResponse = {
  type: 'REGISTER_CACHE_RESPONSE';
  nodeEnv: string;
  cacheName: string;
  messageNames: string[];
  protoCtx: ProtoCtx;
};

export const CacheActionTypes = [
  REGISTER_CACHE,
  REGISTER_CACHE_RESPONSE,
  REGISTER_CACHE_ERROR,
  REFRESH_CACHE,
  REFRESH_CACHE_RESPONSE,
  REFRESH_CACHE_RESPONSE,
  SELECT_QUERY_MESSAGE_NAME,
  SET_CACHE_NAME,
  SEND_QUERY_CACHE_REQUEST,
  SET_QUERY_CACHE_RESPONSE,
  SET_CACHE_REQUEST_ERROR,
];
export type CacheAction =
  | RegisterCache
  | RegisterCacheResponse
  | RefreshCache
  | RefreshCacheResponse
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
      const sTime = Date.now();
      const response = await queryCache(nodeEnv, cacheName, request);
      const time = Date.now() - sTime;
      const responseDescriptor = { response, time };
      dispatch({ type: SET_QUERY_CACHE_RESPONSE, nodeEnv, cacheName, responseDescriptor });
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
  cacheName: string,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: REGISTER_CACHE, cacheName });
    try {
      const protoCtx = await registerCache(nodeEnv, cacheName);
      const messageNames = _.map(protoCtx.types, 'name');
      dispatch({ type: REGISTER_CACHE_RESPONSE, nodeEnv, cacheName, protoCtx, messageNames });
    } catch (err) {
      dispatch({ type: SET_CACHE_REQUEST_ERROR, nodeEnv, cacheName, err });
    }
  };
}

export function refreshCacheAction(
  nodeEnv: string,
  cacheName: string,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: REFRESH_CACHE, cacheName, nodeEnv });
    try {
      const time: Date = await refreshCache(nodeEnv, cacheName);
      dispatch({ type: REFRESH_CACHE_RESPONSE, nodeEnv, cacheName, time });
    } catch (err) {
      dispatch({ type: REFRESH_CACHE_ERROR, nodeEnv, cacheName, err });
    }
  };
}

export function selectCacheName(
  nodeEnv: string,
  cacheName: string,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch, getState): Promise<void> => {
    const s = getState();
    dispatch({ type: SET_CACHE_NAME, cacheName });
    const cache = getByKey(s.caches, cacheName);
    if (!cache || cache.requestStatus !== 'success') {
      await dispatch(registerCacheAction(nodeEnv, cacheName));
    }
  };
}
