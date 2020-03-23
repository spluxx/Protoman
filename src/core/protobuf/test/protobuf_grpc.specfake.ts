import protobuf from 'protobufjs';
import path from 'path';
import { readProtos, buildContext } from '../protoParser';
import { MessageType } from '../protobuf';
import { allPrimitiveTypes } from '../primitiveTypes';

function resolvePath(filename: string): string {
  return path.join(__dirname, filename);
}

async function verifyJson(messageName: string, path: string, payload: any): Promise<string | null> {
  const root = await protobuf.load(path);
  const userMessage = root.lookupType(messageName);
  const errMsg = userMessage.verify(payload);
  return Promise.resolve(errMsg);
}

// tests for supporting grpc: service and methods
test('parser should successfully build a ProtoCtx with a .proto file', async () => {
  const filepaths = [resolvePath('test5.proto')];
  const protoCtx = await buildContext(filepaths);
  expect(Object.keys(protoCtx.types).length).toBe(3 + allPrimitiveTypes.length);
});
