import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../models/AppState';
import { CacheActionTypes, CacheAction } from './CacheAction';
import { CacheQueryResponse, CacheRequestBuilder } from '../../../core/cache';
import { ProtoCtx } from '../../../core/protobuf/protobuf';
import { getEntryByKey } from '../../utils/utils';

export default function CacheReducer(s: AppState, action: AnyAction): AppState {
  if (CacheActionTypes.includes(action.type)) {
    const a = action as CacheAction;

    switch (a.type) {
      case 'REGISTER_CACHE_RESPONSE':
        return produce(s, draft => {
          const protoCtxEntry = getEntryByKey(draft.cache.protoCtxs, a.cacheName);
          if (protoCtxEntry) {
            protoCtxEntry[1] = a.protoCtx as Draft<ProtoCtx>;
          } else {
            draft.cache.protoCtxs.push([a.cacheName, a.protoCtx as Draft<ProtoCtx>]);
          }
        });
        break;
      case 'SELECT_QUERY_MESSAGE_NAME':
        return produce(s, draft => {
          draft.cache.requestBuilder.expectedMessage = action.name;
          draft.cache.requestBuilder.search = {};
        });
        break;
      case 'SEND_QUERY_CACHE_REQUEST':
        return produce(s, draft => {
          draft.cache.requestStatus = 'sending';
          draft.cache.requestError = undefined;
          draft.cache.requestBuilder = a.request as Draft<CacheRequestBuilder>;
          draft.cache.response = undefined;
        });
      case 'SET_QUERY_CACHE_RESPONSE':
        return produce(s, draft => {
          draft.cache.response = a.response as Draft<CacheQueryResponse>;
          draft.cache.requestStatus = 'success';
          draft.cache.requestError = undefined;
        });
      case 'SET_CACHE_REQUEST_ERROR':
        return produce(s, draft => {
          draft.cache.requestStatus = 'failure';
          draft.cache.requestError = a.err;
        });
      case 'SET_CACHE_NAME':
        return produce(s, draft => {
          draft.cache.currentCacheName = a.cacheName;
        });
      default:
        return s;
    }
  }

  return s;
}
