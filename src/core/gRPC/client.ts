/* eslint-disable @typescript-eslint/no-use-before-define */
import { ProtoCtx } from '../protobuf/protobuf';
import { deserializeProtobuf } from '../protobuf/deserializer';

export async function makeRequest(request: any, protoCtx: ProtoCtx) {
  var service = new proto.mypackage.EchoServiceClient('http://localhost:8080');
  return null;
}
