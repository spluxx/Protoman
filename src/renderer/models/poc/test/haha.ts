import { testProtoParser } from './protoParserTest';
import { testMessageParser } from './messageParserTest';
import protobuf from 'protobufjs';

// async function showMeJson(path: string) {
//   const root = await protobuf.load(path);
//   const userMessage = root.lookupType('test3.User');
//   const payload = {
//     favorites: {
//       sports: 'Basketball',
//     },
//   };
//   const errMsg = userMessage.verify(payload);

//   console.log(errMsg);
//   if (errMsg) throw Error(errMsg);
// }

(async () => {
  //await testProtoParser();
  await testMessageParser();
  //showMeJson('./test3.proto');
})();
