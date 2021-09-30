import produce from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../../../models/AppState';
import { getByKey } from '../../../../utils/utils';
import { ExpectedBodyInputActionTypes, ExpectedBodyInputActions } from './ExpectedBodyInputActions';

export default function ExpectedBodyInputReducer(s: AppState, action: AnyAction): AppState {
  if (ExpectedBodyInputActionTypes.includes(action.type)) {
    const a = action as ExpectedBodyInputActions;

    switch (a.type) {
      case 'SELECT_RESPONSE_MESSAGE_NAME':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, draft.currentCollection);
          if (!collection) return draft;
          const flow = getByKey(collection.flows, draft.currentFlow);
          if (!flow) return draft;
          flow.requestBuilder.expectedProtobufMsg = a.name;
          if (!flow.requestBuilder.expectedProtobufMsgOnError) {
            flow.requestBuilder.expectedProtobufMsgOnError = a.name;
          }
        });
      case 'SELECT_RESPONSE_MESSAGE_ON_ERROR_NAME':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, draft.currentCollection);
          if (!collection) return draft;
          const flow = getByKey(collection.flows, draft.currentFlow);
          if (!flow) return draft;
          flow.requestBuilder.expectedProtobufMsgOnError = a.name;
        });
      default:
        return s;
    }
  }

  return s;
}
