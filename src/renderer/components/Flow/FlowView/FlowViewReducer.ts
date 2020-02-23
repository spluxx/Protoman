import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../../models/AppState';
import { FlowViewActionTypes, FlowViewActions } from './FlowViewActions';
import { getByKey } from '../../../utils/utils';
import { Response } from '../../../models/http/response';

export default function FlowViewReducers(s: AppState, action: AnyAction): AppState {
  if (FlowViewActionTypes.includes(action.type)) {
    const a = action as FlowViewActions;

    switch (a.type) {
      case 'SEND_REQUEST':
        return produce(s, draft => {
          const flow = getByKey(getByKey(draft.collections, a.collectionName)?.flows, a.flowName);
          if (!flow) return draft;
          flow.requestStatus = 'sending';
          flow.requestError = undefined;
          flow.response = undefined;
        });
      case 'SET_RESPONSE':
        return produce(s, draft => {
          const flow = getByKey(getByKey(draft.collections, a.collectionName)?.flows, a.flowName);
          if (!flow) return draft;
          flow.response = a.response as Draft<Response>;
          flow.requestStatus = 'success';
          flow.requestError = undefined;
        });
      case 'SET_REQUEST_ERROR':
        return produce(s, draft => {
          const flow = getByKey(getByKey(draft.collections, a.collectionName)?.flows, a.flowName);
          if (!flow) return draft;
          flow.requestError = a.err;
          flow.requestStatus = 'failure';
          flow.response = undefined;
        });
      default:
        return s;
    }
  }

  return s;
}
