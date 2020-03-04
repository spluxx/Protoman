import { RequestBuilder } from './request_builder';
import { ResponseDescriptor } from '../../core/http_client/response';

// A single request-response pair

export interface Flow {
  readonly requestBuilder: RequestBuilder;
  readonly requestStatus: 'default' | 'sending' | 'success' | 'failure';
  readonly requestError: Error | undefined;
  readonly response: ResponseDescriptor | undefined;
}
