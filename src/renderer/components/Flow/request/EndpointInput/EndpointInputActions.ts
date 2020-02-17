import { HttpMethod } from '../../../../models/http/request_builder';

type URLChange = {
  type: 'URL_CHANGE';
  url: string;
};

const URL_CHANGE = 'URL_CHANGE';

type MethodChange = {
  type: 'METHOD_CHANGE';
  method: HttpMethod;
};

const METHOD_CHANGE = 'METHOD_CHANGE';

export const EndpointInputActionTypes = [URL_CHANGE, METHOD_CHANGE];
export type EndpointInputAction = URLChange | MethodChange;

export function changeURL(url: string): URLChange {
  return {
    type: URL_CHANGE,
    url,
  };
}

export function changeMethod(method: HttpMethod): MethodChange {
  return {
    type: METHOD_CHANGE,
    method,
  };
}
