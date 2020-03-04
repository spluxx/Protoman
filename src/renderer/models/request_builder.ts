import { HttpMethod, RequestDescriptor } from '../../core/http_client/request';
import { MessageValue, ProtoCtx } from '../../core/protobuf/protobuf';
import { serializeProtobuf } from '../../core/protobuf/serializer';

export type BodyType = 'none' | 'protobuf';
export const BODY_TYPES: string[] = ['none', 'protobuf'];

export interface RequestBuilder {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly bodyType: BodyType;
  readonly bodies: RequestBody;
  readonly expectedProtobufMsg: string | undefined;
}

export interface RequestBody {
  none: undefined;
  protobuf: MessageValue | undefined;
}

export async function toRequestDescriptor(builder: RequestBuilder, ctx: ProtoCtx): Promise<RequestDescriptor> {
  const { url, method, headers, bodyType, bodies, expectedProtobufMsg } = builder;
  let body;
  if (bodyType === 'protobuf' && bodies.protobuf) {
    body = await serializeProtobuf(bodies.protobuf, ctx.origin[bodies.protobuf?.type.name]);
  } else {
    body = undefined;
  }

  return {
    url,
    method,
    headers,
    body,
    expectedProtobufMsg,
  };
}
