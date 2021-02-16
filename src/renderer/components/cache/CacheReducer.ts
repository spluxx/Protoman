import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../models/AppState';
import { CacheAction, CacheActionTypes } from './CacheAction';
import { CacheRequestBuilder, CacheResponseDescriptor } from '../../../core/Cache';
import { ProtoCtx } from '../../../core/protobuf/protobuf';
import { getByKey } from '../../utils/utils';
import { createDefaultCache } from '../../redux/store';

export default function CacheReducer(s: AppState, action: AnyAction): AppState {
  if (CacheActionTypes.includes(action.type)) {
    const a = action as CacheAction;

    switch (a.type) {
      case 'REGISTER_CACHE':
        return produce(s, draft => {
          const cache = getByKey(draft.caches, a.cacheName);
          if (cache) {
            cache.requestError = undefined;
            cache.requestStatus = 'default';
            cache.protoCtx = undefined;
            cache.messageNames = [];
          } else {
            draft.caches.push([a.cacheName, createDefaultCache()]);
          }
        });
      case 'REGISTER_CACHE_RESPONSE':
        return produce(s, draft => {
          const cache = getByKey(draft.caches, a.cacheName);
          if (cache) {
            cache.requestStatus = 'success';
            cache.requestError = undefined;
            cache.messageNames = a.messageNames;
            cache.requestBuilder.expectedMessage = a.messageNames[0];
            cache.protoCtx = a.protoCtx as Draft<ProtoCtx>;
          }
        });
      case 'REFRESH_CACHE_RESPONSE':
        return produce(s, draft => {
          const cache = getByKey(draft.caches, a.cacheName);
          if (cache) {
            cache.cacheRecency = a.time;
          }
        });
      case 'SELECT_QUERY_MESSAGE_NAME':
        return produce(s, draft => {
          const requestBuilder = getByKey(draft.caches, draft.currentCacheName)?.requestBuilder;
          if (requestBuilder) {
            requestBuilder.expectedMessage = action.name;
            requestBuilder.search = {};
          }
        });
      case 'SEND_QUERY_CACHE_REQUEST':
        return produce(s, draft => {
          const cache = getByKey(draft.caches, draft.currentCacheName);
          if (cache) {
            cache.requestStatus = 'sending';
            cache.requestError = undefined;
            cache.requestBuilder = a.request as Draft<CacheRequestBuilder>;
            cache.responseDescriptor = undefined;
          }
        });
      case 'SET_QUERY_CACHE_RESPONSE':
        return produce(s, draft => {
          const cache = getByKey(draft.caches, draft.currentCacheName);
          if (cache) {
            cache.responseDescriptor = a.responseDescriptor as Draft<CacheResponseDescriptor>;
            cache.cacheRecency = a.responseDescriptor.response.cacheRecency;
            cache.requestStatus = 'success';
            cache.requestError = undefined;
          }
        });
      case 'SET_CACHE_REQUEST_ERROR':
        return produce(s, draft => {
          const cache = getByKey(draft.caches, draft.currentCacheName);
          if (cache) {
            cache.requestStatus = 'failure';
            cache.requestError = a.err;
          }
        });
      case 'SET_CACHE_NAME':
        return produce(s, draft => {
          draft.currentCacheName = a.cacheName;
        });
      default:
        return s;
    }
  }

  return s;
}
