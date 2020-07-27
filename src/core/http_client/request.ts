export const HTTP_METHODS: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS'];

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'COPY' | 'HEAD' | 'OPTIONS';

export interface RequestDescriptor {
  readonly url: string;
  readonly method: HttpMethod;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly body: Uint8Array | undefined;
  readonly expectedProtobufMsg: string | undefined;
  readonly expectedProtobufMsgOnError: string | undefined;
}
