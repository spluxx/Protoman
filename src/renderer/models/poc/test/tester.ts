import { testProtoParser } from './protoParserTest';
import { testMessageParser } from './messageParserTest';

(async () => {
  //await testProtoParser();
  await testMessageParser();
})();
