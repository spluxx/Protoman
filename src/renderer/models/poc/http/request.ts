import { RequestBuilder } from '../../http/request_builder';
import { MessageValue, ProtoCtx } from '../../http/body/protobuf';
import { serialize, deserialize } from './messageParser';
import { Response, ResponseBodyType } from '../../http/response';

function convertHeaders(headers: ReadonlyArray<[string, string]>): Headers {
  return headers.reduce((h, [name, value]) => {
    h.append(name, value);
    return h;
  }, new Headers());
}

function unconvertHeaders(headers: Headers): ReadonlyArray<[string, string]> {
  const h: [string, string][] = [];
  headers.forEach((name: string, value: string) => h.push([name, value]));
  return h;
}

export async function protoRequest(request: RequestBuilder, protoCtx: ProtoCtx): Promise<Response> {
  const body = await (request.body
    ? serialize(request.body, protoCtx.origin[request.body.type.name])
    : Promise.resolve(undefined));

  const resp = await fetch(request.url, {
    method: request.method,
    body: body,
    headers: convertHeaders(request.headers),
  });

  let responseType: ResponseBodyType = 'unknown';
  let responseBody: MessageValue | undefined = undefined;
  const buf = new Uint8Array(await resp.arrayBuffer());

  if (buf.length === 0) {
    responseType = 'empty';
  } else if (request.responseMessageName) {
    responseType = 'protobuf';
    responseBody = await deserialize(
      buf,
      request.responseMessageName,
      protoCtx.origin[request.responseMessageName],
      protoCtx,
    );
  }

  const responseHeaders = unconvertHeaders(resp.headers);

  return {
    statusCode: resp.status,
    headers: responseHeaders,
    body: {
      type: responseType,
      value: responseBody,
    },
  };
}
