import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../../../models/AppState';
import { EndpointInputActionTypes, EndpointInputAction } from './EndpointInputActions';
import { getByKey } from '../../../../utils/utils';
import { RequestBuilder } from '../../../../models/http/request_builder';

function extractRB(d: Draft<AppState>): Draft<RequestBuilder> | undefined {
  const flow = getByKey(getByKey(d.collections, d.currentCollection)?.flows, d.currentFlow);
  return flow?.requestBuilder;
}

export default function EndpointInputReducer(s: AppState, action: AnyAction): AppState {
  if (EndpointInputActionTypes.includes(action.type)) {
    const a = action as EndpointInputAction;

    switch (a.type) {
      case 'URL_CHANGE':
        return produce(s, draft => {
          const rb = extractRB(draft);
          if (rb) {
            rb.url = a.url;
          }
        });
      case 'METHOD_CHANGE':
        return produce(s, draft => {
          const rb = extractRB(draft);
          if (rb) {
            rb.method = a.method;
          }
        });
      default:
        return s;
    }
  }

  return s;
}
