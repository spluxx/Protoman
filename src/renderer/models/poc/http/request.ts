import { RequestBuilder } from '../../http/request_builder';
import { MessageValue, ProtoCtx } from '../../http/body/protobuf';
import { Response, ResponseBodyType } from '../../http/response';
import { deserialize } from './deserializer';
import { serialize } from './serializer';

function convertHeaders(headers: ReadonlyArray<[string, string]>): Headers {
  return headers.reduce((h, [name, value]) => {
    h.append(name, value);
    return h;
  }, new Headers());
}

function unconvertHeaders(headers: Headers): ReadonlyArray<[string, string]> {
  const h: [string, string][] = [];
  headers.forEach((value: string, name: string) => h.push([name, value]));
  return h;
}

export async function protoRequest(request: RequestBuilder, protoCtx: ProtoCtx): Promise<Response> {
  const { bodyType, bodies } = request;

  let body: Uint8Array | undefined;
  switch (bodyType) {
    case 'protobuf':
      if (bodies.protobuf) {
        body = await serialize(bodies.protobuf, protoCtx.origin[bodies.protobuf.type.name]);
      } else {
        throw new Error('Internal Error');
      }
      break;
    case 'none':
      body = undefined;
  }

  const headers = convertHeaders(request.headers);

  const sTime = Date.now();
  const resp = await fetch(request.url, {
    method: request.method,
    body: body,
    headers,
  });
  const dt = Date.now() - sTime;

  const responseHeaders = unconvertHeaders(resp.headers);

  let responseType: ResponseBodyType = 'unknown';
  let responseBody: MessageValue | string | undefined = undefined;
  const buf = new Uint8Array(await resp.arrayBuffer());

  const saidContentType = responseHeaders.find(([name]) => name === 'content-type')?.[1];

  if (buf.length === 0) {
    responseType = 'empty';
  } else if (saidContentType === 'application/json') {
    responseType = 'string';
    try {
      responseBody = JSON.stringify(JSON.parse(new TextDecoder().decode(buf)), null, 2);
    } catch (err) {
      responseBody = 'Error occurred while parsing json:\n' + err.message;
    }
  } else if (saidContentType?.includes('text/html')) {
    responseType = 'string';
    try {
      responseBody = new TextDecoder().decode(buf);
    } catch (err) {
      responseBody = 'Error occurred while decoding html:\n' + err.message;
    }
  } else if (request.responseMessageName) {
    responseType = 'protobuf';
    responseBody = await deserialize(
      buf,
      request.responseMessageName,
      protoCtx.origin[request.responseMessageName],
      protoCtx,
    );
  }

  return {
    statusCode: resp.status,
    headers: responseHeaders,
    body: {
      type: responseType,
      value: responseBody,
    },
    time: dt,
    bodySize: buf.length,
  };
}
