import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../models/AppState';
import { CacheActionTypes, CacheAction } from './CacheAction';
import { CacheData, ProtoCtx } from '../../../core/protobuf/protobuf';
import { createDefaultCacheData } from '../../redux/store';

export default function CacheReducer(s: AppState, action: AnyAction): AppState {
  if (CacheActionTypes.includes(action.type)) {
    const a = action as CacheAction;

    switch (a.type) {
      case 'LOAD_CACHE':
        return produce(s, draft => {
          draft.cache = a.value as Draft<CacheData>;
        });
      default:
        return s;
    }
  }

  return s;
}
