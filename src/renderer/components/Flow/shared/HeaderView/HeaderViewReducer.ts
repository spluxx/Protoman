import { AppState } from '../../../../models/AppState';
import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { HeaderViewActionTypes, HeaderViewAction } from './HeaderViewActions';
import { getByKey } from '../../../../utils/utils';

function extractHeaders(d: Draft<AppState>): Draft<ReadonlyArray<[string, string]>> | undefined {
  const flow = getByKey(getByKey(d.collections, d.currentCollection)?.flows, d.currentFlow);
  return flow?.requestBuilder?.headers;
}

export default function HeaderViewReducer(s: AppState, action: AnyAction): AppState {
  if (HeaderViewActionTypes.includes(action.type)) {
    const a = action as HeaderViewAction;

    switch (a.type) {
      case 'CREATE_HEADER':
        return produce(s, draft => {
          const headers = extractHeaders(draft);
          headers?.splice?.(headers.length, 0, ['', '']);
        });
      case 'DELETE_HEADER':
        return produce(s, draft => {
          const headers = extractHeaders(draft);
          headers?.splice?.(a.idx, 1);
        });
      case 'CHANGE_HEADER_NAME':
        return produce(s, draft => {
          const headers = extractHeaders(draft);
          if (headers) {
            headers[a.idx][0] = a.name;
          }
        });
      case 'CHANGE_HEADER_VALUE':
        return produce(s, draft => {
          const headers = extractHeaders(draft);
          if (headers) {
            headers[a.idx][1] = a.value;
          }
        });
      default:
        return s;
    }
  }

  return s;
}
