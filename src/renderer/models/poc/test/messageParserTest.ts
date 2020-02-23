import * as assert from 'assert';
import { createMessageRecurse } from '../http/serializer';
import { createMessageValue } from '../http/deserializer';
import { userValue, userType, sampleCtx, test3UserExpectedJson } from './test3dummyValue';
import { verifyJson } from './testUtils';

export async function testMessageParser(): Promise<void> {
  console.log('Testing for Message Parser starting');

  console.log('message value to json');
  const jsonObject = createMessageRecurse(userValue);
  assert.deepEqual(jsonObject, test3UserExpectedJson);

  console.log('verify json');
  await verifyJson('test3.User', './test3.proto', jsonObject);

  console.log('json to message value');
  console.log(jsonObject);
  const messageValue = createMessageValue(userType, jsonObject, sampleCtx);
  console.log(messageValue);
}
