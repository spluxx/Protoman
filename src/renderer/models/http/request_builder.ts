import { MessageValue } from './body/protobuf';

export const HTTP_METHODS: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS'];

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'COPY' | 'HEAD' | 'OPTIONS';

export interface RequestBuilder {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers: Readonly<{ [key: string]: string }>;
  readonly body: MessageValue | null;
  readonly responseMessageName: string | null;
}
