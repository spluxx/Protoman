import { RequestBuilder } from './request_builder';
import { Response } from './response';

// A single request-response pair

export interface Flow {
  readonly requestBuilder: RequestBuilder;
  readonly response: Response | undefined;
}
