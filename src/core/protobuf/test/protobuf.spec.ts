import protobuf from 'protobufjs';
import { test3UserExpectedJson, userValue, sampleCtx, userType } from './test3dummyValue';
import { createMessageRecurse } from '../serializer';
import { createMessageValue } from '../deserializer';
import { classValue, test4UserExpectedJson, classType, sampleCtx2 } from './test4dummyValue';
import { test4UserValueExpected } from './test4JSON';
import path from 'path';
import { readProtos, buildContext } from '../protoParser';
import { MessageType, EnumType } from '../protobuf';
import { allPrimitiveTypes } from '../primitiveTypes';

function resolvePath(filename: string): string {
  return path.join(__dirname, filename);
}

async function verifyJson(messageName: string, path: string, payload: any): Promise<string | null> {
  const root = await protobuf.load(path);
  const userMessage = root.lookupType(messageName);
  const errMsg = userMessage.verify(payload);
  return Promise.resolve(errMsg);
}

test('createMessageRecurse(serialize) should successfully serialize a MessageValue', async () => {
  const json = createMessageRecurse(userValue);
  expect(json).toStrictEqual(test3UserExpectedJson);
  const err = await verifyJson('test3.User', resolvePath('test3.proto'), json);
  expect(err).toBe(null);
});

test('createMessageRecurse(serialize) should successfully serialize a MessageValue', async () => {
  const json = createMessageRecurse(classValue);
  expect(json).toStrictEqual(test4UserExpectedJson);
  const err = await verifyJson('test3.User', resolvePath('test3.proto'), json);
  expect(err).toBe(null);
});

test('createMessageValue(deserialize) should successfully deserialize a json', () => {
  const messageValue = createMessageValue(userType, test3UserExpectedJson, sampleCtx);
  expect(messageValue).toStrictEqual(userValue);
});

test('createMessageValue(deserialize) should successfully deserialize a json', () => {
  const messageValue = createMessageValue(classType, test4UserExpectedJson, sampleCtx2);
  expect(messageValue).toStrictEqual(test4UserValueExpected);
});

test('parser should successfully build a ProtoCtx with the given filepath', async () => {
  const filepaths = [resolvePath('test1.proto')];

  const res = await readProtos(filepaths);
  const [testTypes, origin] = res;

  const [ckType, userType, userRole] = testTypes;

  const ckTypeExpected: MessageType = {
    tag: 'message',
    name: '.test1.Ck',
    singleFields: [
      ['male', 'string'],
      ['female', 'string'],
    ],
    repeatedFields: [],
    oneOfFields: [],
    mapFields: [],
  };

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
      ['ck', '.test1.Ck'],
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

  const userRoleExpected: EnumType = {
    tag: 'enum',
    name: '.test1.User.UserRole',
    options: ['NORMAL_USER', 'ADMIN'],
    optionValues: {
      NORMAL_USER: 0,
      ADMIN: 1,
    },
  };

  expect(userType).toStrictEqual(userTypeExpected);
  expect(userRole).toStrictEqual(userRoleExpected);
  expect(ckType).toStrictEqual(ckTypeExpected);
  expect(origin['.test1.User']).toBe(filepaths[0]);
  expect(origin['.test1.User.UserRole']).toBe(filepaths[0]);
  expect(origin['.test1.Ck']).toBe(filepaths[0]);
});

test('parser should successfully build a ProtoCtx with a .proto file', async () => {
  const filepaths = [resolvePath('test1.proto')];
  const protoCtx = await buildContext(filepaths);
  expect(Object.keys(protoCtx.types).length).toBe(3 + allPrimitiveTypes.length);
});

test('parser should successfully build a ProtoCtx with multiple .proto files', async () => {
  const filepaths = [resolvePath('test1.proto'), resolvePath('test2.proto')];
  const protoCtx = await buildContext(filepaths);
  expect(Object.keys(protoCtx.types).length).toBe(5 + allPrimitiveTypes.length);
});
