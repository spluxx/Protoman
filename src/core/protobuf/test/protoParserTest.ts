import { readProtos, buildContext } from '../protoParser';
import { MessageType } from '../protobuf';
import isEqual from 'lodash.isequal';
import { equal, strictEqual } from 'assert';

const testFilePaths1: string[] = ['./test1.proto'];
const testFilePathsAll: string[] = ['./test1.proto', './test2.proto'];

const userTypeExpected: MessageType = {
  tag: 'message',
  name: '.test1.User',
  singleFields: [
    ['userId', 'string'],
    ['firstName', 'string'],
    ['lastName', 'string'],
    ['photoUrl', 'string'],
    ['isOnboarding', 'bool'],
    ['points', 'sint32'],
    ['numThanks', 'uint32'],
    ['numRevokes', 'uint32'],
    ['isAdmin', 'bool'],
    ['fuck', '.test1.Fuck'],
  ],
  repeatedFields: [],
  oneOfFields: [
    [
      'answer',
      [
        ['booleanValue', 'bool'],
        ['integerValue', 'string'],
        ['doubleValue', 'double'],
        ['textValue', 'string'],
      ],
    ],
  ],
  mapFields: [['asset', ['string', 'int32']]],
};

const fuckTypeExpected: MessageType = {
  tag: 'message',
  name: '.test1.Fuck',
  singleFields: [
    ['male', 'string'],
    ['female', 'string'],
  ],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

export async function testProtoParser(): Promise<void> {
  console.log('test starting');
  console.log('testing test1.proto');
  const testResult1 = await readProtos(testFilePaths1);
  const test1Types = testResult1[0];
  const fuckType = test1Types[0];
  equal(isEqual(fuckType, fuckTypeExpected), true);
  const userType = test1Types[1];
  equal(isEqual(userType, userTypeExpected), true);

  console.log('check origin');
  const test1Origin = testResult1[1];
  console.log(test1Origin);

  console.log('check ctx');
  const test1Ctx = await buildContext(testFilePaths1);
  equal(isEqual(Object.keys(test1Ctx.types).length, 17), true);

  console.log('testing allFilePaths');
  const testResultAll = await readProtos(testFilePathsAll);
  const testAllTypes = testResultAll[0];
  strictEqual(testAllTypes.length, 19);
  console.log('test has ended');

  return Promise.resolve();
}
