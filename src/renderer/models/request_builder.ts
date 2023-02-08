import { HttpMethod, RequestDescriptor } from '../../core/http_client/request';
import { MessageValue, ProtoCtx } from '../../core/protobuf/protobuf';
import { serializeProtobuf } from '../../core/protobuf/serializer';
import { serializeJSON } from '../../core/json/serializer';
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
  json: string | undefined;
}

export async function toRequestDescriptor(
  builder: RequestBuilder,
  env: Env,
  ctx: ProtoCtx,
): Promise<RequestDescriptor> {
  const { url, method, headers, bodyType, bodies, expectedProtobufMsg, expectedProtobufMsgOnError } = builder;
  const varMap = toVarMap(env);

  let body;
  let contentType;

  if (bodyType === 'protobuf' && bodies.protobuf) {
    const withEnv = applyToProtoMessage(bodies.protobuf, (s: string | null): string | null =>
      s !== null ? applyEnvs(s, varMap) : null,
    );
    body = await serializeProtobuf(withEnv, ctx);
    contentType = 'application/x-protobuf';
  } else if (bodyType === 'json') {
    const withEnv = bodies.json || null;
    if (withEnv != null) {
      body = await serializeJSON(withEnv);
      contentType = 'application/json';
    } else {
      body = undefined;
    }
  } else {
    body = undefined;
  }

  const headersWithContentType = headers.map<[string, string]>(([k, v]) => [k, applyEnvs(v, varMap)]);
  const hasContentType = headers.find(k => {
    k[0].toLowerCase() === 'content-type';
  });

  if (contentType && !hasContentType) {
    headersWithContentType.push(['Content-Type', contentType]);
  }

  return {
    url: applyEnvs(url, varMap),
    method,
    headers: headersWithContentType,
    body,
    expectedProtobufMsg,
    expectedProtobufMsgOnError,
  };
}
