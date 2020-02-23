import protobuf from 'protobufjs';

export async function verifyJson(messageName: string, path: string, payload: any): Promise<void> {
  const root = await protobuf.load(path);
  const userMessage = root.lookupType(messageName);
  const errMsg = userMessage.verify(payload);
  console.log(errMsg);
  if (errMsg) throw Error(errMsg);
}
