import { RequestBuilder } from '../../../models/http/request_builder';
import { ProtoCtx } from '../../../models/http/body/protobuf';
import { Response } from '../../../models/http/response';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../models/AppState';
import { AnyAction } from 'redux';
import { protoRequest } from '../../../models/poc/http/request';

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
  response: Response;
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
  ctx: ProtoCtx,
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: SEND_REQUEST, collectionName, flowName });
    try {
      const response = await protoRequest(builder, ctx);
      dispatch({ type: SET_RESPONSE, collectionName, flowName, response });
    } catch (err) {
      dispatch({ type: SET_REQUEST_ERROR, collectionName, flowName, err });
    }
  };
}
