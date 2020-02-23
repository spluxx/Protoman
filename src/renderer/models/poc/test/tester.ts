import { testMessageParser } from './serializeDeserializeTest';
import { testProtoParser } from './protoParserTest';

(async (): Promise<void> => {
  await testProtoParser();
  //await testMessageParser();
})();
