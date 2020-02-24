import { createMessageRecurse } from '../http/serializer';
import { createMessageValue } from '../http/deserializer';
import { userValue, userType, sampleCtx, test3UserExpectedJson } from './test3dummyValue';
import { classType, classValue, sampleCtx2, test4UserExpectedJson } from './test4dummyValue';
import { verifyJson } from './testUtils';
import { isEqual } from 'lodash';
export async function testMessageParser(): Promise<void> {
  console.log('-------Test1: testfile is test3.proto---------');
  console.log('-------Part A: message value to json ----------');
  const jsonObject1 = createMessageRecurse(userValue);
  isEqual(jsonObject1, test3UserExpectedJson);
  console.log('verifing json');
  const errResult1 = await verifyJson('test3.User', './test3.proto', jsonObject1);
  isEqual(null, errResult1);
  console.log('-------Part B: json to message value ----------');
  const messageValue1 = createMessageValue(userType, test3UserExpectedJson, sampleCtx);
  isEqual(messageValue1, userValue);

  console.log('-------Test2: testfile is test4.proto---------');
  console.log('-------Part A: message value to json ----------');

  const jsonObject2 = createMessageRecurse(classValue);
  //console.log(jsonObject2.instructors);
  isEqual(jsonObject2, test4UserExpectedJson);
  console.log('verifing json');
  const errResult2 = await verifyJson('test3.User', './test3.proto', jsonObject2);
  isEqual(null, errResult2);
  console.log('-------Part B: json to message value ----------');
  const messageValue2 = createMessageValue(classType, test4UserExpectedJson, sampleCtx2);
  isEqual(messageValue2, classValue);

  console.log('all tests passed, good to go');
}
