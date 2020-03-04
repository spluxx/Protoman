export const HTTP_METHODS: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS'];

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'COPY' | 'HEAD' | 'OPTIONS';

export interface RequestDescriptor {
  url: string;
  method: HttpMethod;
  headers: [string, string][];
  body: Uint8Array | undefined;

  expectedProtobufMsg: string | undefined;
}
