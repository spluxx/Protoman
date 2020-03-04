import { MessageValue } from '../protobuf/protobuf';

// string for json and html - deserves better support, but this will do for now.
export type ResponseBodyType = 'empty' | 'protobuf' | 'json' | 'html' | 'unknown';
export type ResponseBodyValue = undefined | MessageValue | string;

export interface ResponseBody {
  readonly type: ResponseBodyType;
  readonly value: ResponseBodyValue;
  readonly bodySize: number;
}

export interface ResponseDescriptor {
  readonly statusCode: number;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly body: ResponseBody;
  readonly time: number; // ms
}
