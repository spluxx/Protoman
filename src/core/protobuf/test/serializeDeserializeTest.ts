import { createMessageRecurse } from '../serializer';
import { createMessageValue } from '../deserializer';
import { userValue, userType, sampleCtx, test3UserExpectedJson } from './test3dummyValue';
import { classType, classValue, sampleCtx2, test4UserExpectedJson } from './test4dummyValue';
import { test4UserValueExpected } from './test4JSON';
import { verifyJson } from './testUtils';
import isEqual from 'lodash.isequal';
import { equal } from 'assert';
export async function testMessageParser(): Promise<void> {
  console.log('-------Test1: testfile is test3.proto---------');
  console.log('-------Part A: message value to json ----------');
  const jsonObject1 = createMessageRecurse(userValue);
  //console.log(JSON.stringify(jsonObject1));
  equal(isEqual(jsonObject1, test3UserExpectedJson), true);
  console.log('verifing json');
  const errResult1 = await verifyJson('test3.User', './test3.proto', jsonObject1);
  equal(isEqual(null, errResult1), true);
  console.log('-------Part B: json to message value ----------');
  const messageValue1 = createMessageValue(userType, test3UserExpectedJson, sampleCtx);
  equal(isEqual(messageValue1, userValue), true);

  console.log('-------Test2: testfile is test4.proto---------');
  console.log('-------Part A: message value to json ----------');

  const jsonObject2 = createMessageRecurse(classValue);
  equal(isEqual(jsonObject2, test4UserExpectedJson), true);
  console.log('verifing json');
  const errResult2 = await verifyJson('test3.User', './test3.proto', jsonObject2);
  equal(isEqual(null, errResult2), true);
  console.log('-------Part B: json to message value ----------');
  const messageValue2 = createMessageValue(classType, test4UserExpectedJson, sampleCtx2);
  // number/boolean values in the expected object were changed to strings - Inchan
  equal(isEqual(messageValue2, test4UserValueExpected), true);

  console.log('all tests passed, good to go');
}
