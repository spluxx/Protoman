import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../models/AppState';
import { AnyAction } from 'redux';
import { makeRequest } from '../../../events';
import { ProtoCtx } from '../../../../core/protobuf/protobuf';
import { RequestBuilder, toRequestDescriptor } from '../../../models/request_builder';
import { ResponseDescriptor } from '../../../../core/http_client/response';
import { Env } from '../../../models/Env';

type SendRequest = {
  type: 'SEND_REQUEST';
  collectionName: string;
  flowName: string;
};

const SEND_REQUEST = 'SEND_REQUEST';

type SetResponse = {
  type: 'SET_RESPONSE';
  collectionName: string;
  flowName: string;
  response: ResponseDescriptor;
};

const SET_RESPONSE = 'SET_RESPONSE';

type SetRequestError = {
  type: 'SET_REQUEST_ERROR';
  collectionName: string;
  flowName: string;
  err: Error;
};

const SET_REQUEST_ERROR = 'SET_REQUEST_ERROR';

export const FlowViewActionTypes = [SEND_REQUEST, SET_RESPONSE, SET_REQUEST_ERROR];

export type FlowViewActions = SendRequest | SetResponse | SetRequestError;

export function sendRequest(
  collectionName: string,
  flowName: string,
  builder: RequestBuilder,
  env: Env,
  ctx: ProtoCtx,
): ThunkAction<Promise<void>, AppState, unknown, AnyAction> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: SEND_REQUEST, collectionName, flowName });
    try {
      const rd = await toRequestDescriptor(builder, env, ctx);
      const response = await makeRequest(rd, ctx);
      dispatch({ type: SET_RESPONSE, collectionName, flowName, response });
    } catch (err) {
      dispatch({ type: SET_REQUEST_ERROR, collectionName, flowName, err });
    }
  };
}
