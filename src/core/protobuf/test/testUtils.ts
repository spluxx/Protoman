import protobuf from 'protobufjs';

export async function verifyJson(messageName: string, path: string, payload: any): Promise<string | null> {
  const root = await protobuf.load(path);
  const userMessage = root.lookupType(messageName);
  const errMsg = userMessage.verify(payload);
  return Promise.resolve(errMsg);
}
