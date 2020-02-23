import { MessageValue } from './body/protobuf';

export interface Response {
  readonly statusCode: number;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly body: ResponseBody;
}

export type ResponseBodyType = 'empty' | 'protobuf' | 'unknown';

export interface ResponseBody {
  type: ResponseBodyType;
  value: undefined | MessageValue | string;
}

// TODO(Inchan Hwang): Fill these in
export function statusCodeToText(code: number): string {
  switch (code) {
    case 200:
      return 'Success';
    case 400:
      return 'BadRequest';
    default:
      return '';
  }
}
