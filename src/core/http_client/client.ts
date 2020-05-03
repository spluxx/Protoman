/* eslint-disable @typescript-eslint/no-use-before-define */
import { RequestDescriptor } from './request';
import { ProtoCtx } from '../protobuf/protobuf';
import { convertHeaders, unconvertHeaders } from './headers';
import { ResponseBodyValue, ResponseDescriptor, ResponseBodyType } from './response';
import fetch, { Response } from 'node-fetch';
import { deserializeProtobuf } from '../protobuf/deserializer';

const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_HTML = 'text/html';

export async function makeRequest(request: RequestDescriptor, protoCtx: ProtoCtx): Promise<ResponseDescriptor> {
  const { url, method, body } = request;

  const headers = convertHeaders(request.headers);

  const sTime = Date.now();
  const resp = await fetch(url, { method, body, headers });
  const eTime = Date.now();

  const dt = eTime - sTime;

  return translateResponse(resp, request, protoCtx, dt);
}

async function translateResponse(
  response: Response,
  request: RequestDescriptor,
  protoCtx: ProtoCtx,
  dt: number,
): Promise<ResponseDescriptor> {
  const responseHeaders = unconvertHeaders(response.headers);
  const saidContentType = responseHeaders.find(([name]) => name === 'content-type')?.[1];

  const { expectedProtobufMsg } = request;

  let responseBodyType: ResponseBodyType = 'unknown';
  let responseBodyValue: ResponseBodyValue = undefined;
  let warning: string | undefined = undefined;

  const buf = new Uint8Array(await response.arrayBuffer());

  if (buf.length === 0) {
    responseBodyType = 'empty';
    responseBodyValue = undefined;
  } else if (saidContentType === CONTENT_TYPE_JSON) {
    responseBodyType = 'json';
    responseBodyValue = toJson(buf);
  } else if (saidContentType?.includes(CONTENT_TYPE_HTML)) {
    responseBodyType = 'html';
    responseBodyValue = toStr(buf);
  } else if (expectedProtobufMsg) {
    const res = await deserializeProtobuf(buf, expectedProtobufMsg, protoCtx);
    switch (res.tag) {
      case 'invalid':
        if (res.value) {
          responseBodyType = 'json';
          responseBodyValue = res.value;
        } else {
          responseBodyType = 'unknown';
          responseBodyValue = undefined;
        }
        warning = res.error;
        break;
      case 'valid':
        responseBodyType = 'protobuf';
        responseBodyValue = res.value;
        break;
    }
  }

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: {
      type: responseBodyType,
      value: responseBodyValue,
      bodySize: buf.length,
    },
    warning,
    time: dt,
  };
}

function toStr(buf: Uint8Array): string {
  try {
    return new TextDecoder().decode(buf);
  } catch (err) {
    throw new Error('Error occurred while decoding body to string:\n' + err.message);
  }
}

function toJson(buf: Uint8Array): string {
  const str = toStr(buf);
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch (err) {
    throw new Error('Error occurred while parsing json:\n' + err.message + '\nGiven JSON:\n' + str);
  }
}
