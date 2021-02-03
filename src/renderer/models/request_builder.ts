import { HttpMethod, RequestDescriptor } from '../../core/http_client/request';
import { MessageValue, ProtoCtx } from '../../core/protobuf/protobuf';
import { serializeProtobuf } from '../../core/protobuf/serializer';
import { createMessageValue } from '../../core/protobuf/deserializer';
import { Env, toVarMap } from './Env';
import { applyEnvs } from '../../core/env';
import { applyToProtoMessage } from '../../core/protobuf/ap';

export type BodyType = 'none' | 'protobuf' | 'json';
export const BODY_TYPES: string[] = ['none', 'protobuf', 'json'];

export interface RequestBuilder {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly bodyType: BodyType;
  readonly bodies: RequestBody;
  readonly expectedProtobufMsg?: string;
  readonly expectedProtobufMsgOnError?: string;
}

export interface RequestBody {
  none: undefined;
  protobuf: MessageValue | undefined;
}

export async function toRequestDescriptor(
  builder: RequestBuilder,
  env: Env,
  ctx: ProtoCtx,
): Promise<RequestDescriptor> {
  const { url, method, headers, bodyType, bodies, expectedProtobufMsg, expectedProtobufMsgOnError } = builder;
  const varMap = toVarMap(env);

  let body;
  if (bodyType === 'protobuf' && bodies.protobuf) {
    const withEnv = applyToProtoMessage(bodies.protobuf, (s: string): string => applyEnvs(s, varMap));
    body = await serializeProtobuf(withEnv, ctx);
  } else {
    body = undefined;
  }

  return {
    url: applyEnvs(url, varMap),
    method,
    headers: headers.map(([k, v]) => [k, applyEnvs(v, varMap)]),
    body,
    expectedProtobufMsg,
    expectedProtobufMsgOnError,
  };
}
