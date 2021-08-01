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
          if (idx < 0) return draft;

          draft.collections.splice(idx, 1);
          if (draft.currentCollection === a.collectionName) {
            draft.currentCollection = draft.collections[0][0];
            const flows = getByKey(draft.collections, draft.currentCollection)?.flows;
            if (!flows) return draft;
            draft.currentFlow = flows[0][0];
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
          if (!flows) return draft;
          const idx = flows.findIndex(([n]) => n === a.flowName);
          if (idx < 0) return draft;

          flows.splice(idx, 1);
          if (a.flowName === draft.currentFlow && a.collectionName === draft.currentCollection) {
            draft.currentFlow = flows[0][0];
          }
        });
      case 'CLONE_FLOW':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          const flows = collection?.flows;
          if (!flows) return draft;
          const idx = flows.findIndex(([n]) => n === a.originalFlowName);
          let original_flow = flows[idx][1];
          flows.push([a.flowName, original_flow]);
          draft.currentCollection = a.collectionName;
          draft.currentFlow = a.flowName;
        });
      case 'OPEN_FM':
        return produce(s, draft => {
          draft.fmOpenCollection = a.collectionName;
        });
      case 'CLOSE_FM':
        return produce(s, draft => {
          draft.fmOpenCollection = undefined;
        });
      case 'REORDER_FLOW':
        return produce(s, draft => {
          const flows = getByKey(draft.collections, a.collectionName)?.flows;
          if (!flows) return draft;

          const [rm] = flows.splice(a.src, 1);
          flows.splice(a.dst, 0, rm);
        });
      default:
        return s;
    }
  }

  return s;
}
