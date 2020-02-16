import { MessageValue } from './body/protobuf';

export const HTTP_METHODS: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS'];

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'COPY' | 'HEAD' | 'OPTIONS';

export interface RequestBuilder {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly body: MessageValue | undefined;
  readonly responseMessageName: string | undefined;
}
