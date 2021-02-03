import produce from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../models/AppState';
import { CacheActionTypes, CacheAction } from './CacheAction';
import { CacheData } from '../../../core/protobuf/protobuf';

export default function CacheReducer(s: AppState, action: AnyAction): AppState {
  if (CacheActionTypes.includes(action.type)) {
    const a = action as CacheAction;

    switch (a.type) {
      case 'LOAD_CACHE':
        return produce(s, draft => {
          draft.cache = a.value as CacheData[];
        });
      default:
        return s;
    }
  }

  return s;
}
