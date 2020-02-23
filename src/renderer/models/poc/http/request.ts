import { RequestBuilder } from '../../http/request_builder';
import { MessageValue, ProtoCtx } from '../../http/body/protobuf';
import { deserialize } from './deserializer';
import { serialize } from './serializer';

function convertHeaders(headers: ReadonlyArray<[string, string]>): Headers {
  return headers.reduce((h, [name, value]) => {
    h.append(name, value);
    return h;
  }, new Headers());
}

export async function protoRequest(
  request: RequestBuilder,
  filePath: string,
  protoCtx: ProtoCtx,
): Promise<MessageValue | undefined> {
  const body = await (request.body ? serialize(request.body, filePath) : Promise.resolve(undefined));

  const resp = await fetch(request.url, {
    method: request.method,
    body: body,
    headers: convertHeaders(request.headers),
  });

  if (request.responseMessageName) {
    const buf = new Uint8Array(await resp.arrayBuffer());
    return deserialize(buf, request.responseMessageName, filePath, protoCtx);
  } else {
    return Promise.resolve(undefined);
  }
}
