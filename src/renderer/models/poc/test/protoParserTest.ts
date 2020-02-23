import * as assert from 'assert';
import { readProtos, buildContext } from '../engine/protoParser';
import { allPrimitiveTypes } from '../engine/primitiveTypes';
import { MessageType } from '../../http/body/protobuf';
import { isEqual } from 'lodash';

const testFilePaths1: string[] = ['./test1.proto'];
const testFilePaths2: string[] = ['./test2.proto'];
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
  isEqual(fuckType, fuckTypeExpected);
  const userType = test1Types[1];
  isEqual(userType, userTypeExpected);

  console.log('check origin');
  const test1Origin = testResult1[1];
  console.log(test1Origin);

  console.log('check ctx');
  const test1Ctx = await buildContext(testFilePaths1);
  isEqual(test1Ctx.types.length, 17);

  console.log('testing allFilePaths');
  const testResultAll = await readProtos(testFilePathsAll);
  const testAllTypes = testResultAll[0];
  assert.strictEqual(testAllTypes.length, 19);
  console.log('test has ended');

  return Promise.resolve();
}
