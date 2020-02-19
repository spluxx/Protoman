import produce from 'immer';
import { AnyAction } from 'redux';
import { ProtofileManagerActionTypes, ProtofileManagerActions } from './ProtofileManagerActions';
import { AppState } from '../../../models/AppState';
import { getByKey } from '../../../utils/utils';

export default function ProtofileManagerReducer(s: AppState, action: AnyAction): AppState {
  if (ProtofileManagerActionTypes.includes(action.type)) {
    const a = action as ProtofileManagerActions;

    switch (a.type) {
      case 'SET_PROTOFILES':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          if (collection) {
            collection.protoFilepaths = a.filepaths;
          }
        });
      default:
        return s;
    }
  }

  return s;
}
