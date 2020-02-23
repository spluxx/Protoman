import { createMessageRecurse } from '../http/serializer';
import { createMessageValue } from '../http/deserializer';
import { userValue, userType, sampleCtx, test3UserExpectedJson } from './test3dummyValue';
import { verifyJson } from './testUtils';
import { isEqual } from 'lodash';
export async function testMessageParser(): Promise<void> {
  console.log('Testing for Message Parser starting');

  console.log('message value to json');
  const jsonObject = createMessageRecurse(userValue);
  isEqual(jsonObject, test3UserExpectedJson);
  console.log('verifing json');
  const errResult = await verifyJson('test3.User', './test3.proto', jsonObject);
  isEqual(null, errResult);

  console.log('json to message value');
  const messageValue = createMessageValue(userType, test3UserExpectedJson, sampleCtx);
  isEqual(messageValue, userValue);

  console.log('all tests passed');
}
