//receive response from the channle

import { MessageValue } from '../protobuf/protobuf';

export type ResponseBodyValue = undefined | MessageValue;

export interface GrpcResponseBody {
  readonly value: ResponseBodyValue;
  readonly bodySize: number;
}
export interface GrpcResponseDesciptor {
  readonly statusCode: number; //ex) 400
  readonly headers: ReadonlyArray<[string, string]>;
  readonly body: GrpcResponseBody;
  readonly time: number; // ms
  readonly channleID: number;
}
