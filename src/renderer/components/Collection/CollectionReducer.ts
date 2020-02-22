import { AppState } from '../../models/AppState';
import { AnyAction } from 'redux';
import { CollectionActionTypes, CollectionAction } from './CollectionActions';
import produce from 'immer';
import { getEntryByKey, getByKey } from '../../utils/utils';
import { createDefaultCollection, createDefaultFlow } from '../../redux/store';

export default function CollectionReducer(s: AppState, action: AnyAction): AppState {
  if (CollectionActionTypes.includes(action.type)) {
    const a = action as CollectionAction;

    switch (a.type) {
      case 'CREATE_COLLECTION':
        return produce(s, draft => {
          draft.collections.push([a.collectionName, createDefaultCollection()]);
        });
      case 'CHANGE_COLLECTION_NAME':
        return produce(s, draft => {
          const collection = getEntryByKey(draft.collections, a.collectionName);
          if (collection) {
            collection[0] = a.newName;
            if (draft.currentCollection === a.collectionName) {
              draft.currentCollection = a.newName;
            }
            const idx = draft.openCollections.findIndex(n => n === a.collectionName);
            if (idx >= 0) {
              draft.openCollections[idx] = a.newName;
            }
          }
        });
      case 'DELETE_COLLECTION':
        return produce(s, draft => {
          const idx = draft.collections.findIndex(([n]) => n === a.collectionName);
          if (idx >= 0) {
            draft.collections.splice(idx, 1);
          }
        });
      case 'TOGGLE_COLLECTIONS':
        return produce(s, draft => {
          draft.openCollections = a.openCollections;
        });
      case 'CREATE_FLOW':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          const flows = collection?.flows;
          if (flows) {
            flows.push([a.flowName, createDefaultFlow()]);
            draft.currentCollection = a.collectionName;
            draft.currentFlow = a.flowName;
          }
        });
      case 'SELECT_FLOW':
        return produce(s, draft => {
          draft.currentCollection = a.collectionName;
          draft.currentFlow = a.flowName;
        });
      case 'DELETE_FLOW':
        return produce(s, draft => {
          const flows = getByKey(draft.collections, a.collectionName)?.flows;
          const idx = flows?.findIndex(([n]) => n === a.flowName);
          if (idx != null && idx >= 0) {
            flows?.splice(idx, 1);
          }
        });
      default:
        return s;
    }
  }

  return s;
}
