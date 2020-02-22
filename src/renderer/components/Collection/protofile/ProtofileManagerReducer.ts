import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { ProtofileManagerActionTypes, ProtofileManagerActions } from './ProtofileManagerActions';
import { AppState } from '../../../models/AppState';
import { getByKey } from '../../../utils/utils';
import { ProtoCtx } from '../../../models/http/body/protobuf';

export default function ProtofileManagerReducer(s: AppState, action: AnyAction): AppState {
  if (ProtofileManagerActionTypes.includes(action.type)) {
    const a = action as ProtofileManagerActions;

    switch (a.type) {
      case 'SET_PROTOFILES':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          if (collection) {
            collection.protoFilepaths = a.filepaths;
            collection.buildStatus = 'default';
            collection.buildError = undefined;
          }
        });
      case 'BUILD_PROTOFILES':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          if (collection) {
            collection.buildStatus = 'building';
            collection.buildError = undefined;
          }
        });
      case 'BUILD_PROTOFILES_SUCCESS':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          if (collection) {
            collection.buildStatus = 'success';
            collection.buildError = undefined;
            collection.protoCtx = a.ctx as Draft<ProtoCtx>;
            collection.messageNames = Object.values(a.ctx.types)
              .filter(t => t.tag === 'message')
              .map(t => t.name);
          }
        });
      case 'BUILD_PROTOFILES_FAILURE':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, a.collectionName);
          if (collection) {
            collection.buildStatus = 'failure';
            collection.buildError = a.err;
          }
        });
      default:
        return s;
    }
  }

  return s;
}
