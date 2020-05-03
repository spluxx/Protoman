import protobuf from 'protobufjs';
import { test3UserExpectedJson, userValue, sampleCtx, userType } from './test3dummyValue';
import { createMessageRecurse, serializeProtobuf } from '../serializer';
import { createMessageValue, deserializeProtobuf } from '../deserializer';
import { classValue, test4UserExpectedJson, classType, sampleCtx2 } from './test4dummyValue';
import { test4UserValueExpected } from './test4JSON';
import path from 'path';
import { buildContext } from '../protoParser';
import { MessageType, EnumType, PrimitiveType, MessageValue } from '../protobuf';
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

  const res = await buildContext(filepaths);
  const testTypes = res.types;

  const ckType = testTypes['.test1.Ck'];
  const userType = testTypes['.test1.User'];
  const userRole = testTypes['.test1.User.UserRole'];

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

test('parser should successfully build a ProtoCtx that imports using root directory', async () => {
  const filepaths = [
    resolvePath('test5/account/api/account_test.proto'),
    resolvePath('test5/account/data/account.proto'),
    resolvePath('test5/common/valid.proto'),
  ];

  const rootPath = resolvePath('test5');

  const protoCtx = await buildContext(filepaths, rootPath);
  expect(Object.keys(protoCtx.types).length).toBe(3 + allPrimitiveTypes.length);
});

test('serialize -> deserialize should give the same MessageValue', async () => {
  const filepaths = [
    resolvePath('test5/account/api/account_test.proto'),
    resolvePath('test5/account/data/account.proto'),
    resolvePath('test5/common/valid.proto'),
  ];

  const rootPath = resolvePath('test5');

  const protoCtx = await buildContext(filepaths, rootPath);

  const messageTypeName = '.account.data.Account';

  const accountType = protoCtx.types[messageTypeName] as MessageType;
  const int64Type = protoCtx.types['int64'] as PrimitiveType;
  const stringType = protoCtx.types['string'] as PrimitiveType;

  const messageValue: MessageValue = {
    type: accountType,
    singleFields: [
      [
        'accountId',
        {
          type: int64Type,
          value: '1',
        },
      ],
      [
        'firstName',
        {
          type: stringType,
          value: 'proto',
        },
      ],
      [
        'lastName',
        {
          type: stringType,
          value: 'man',
        },
      ],
      [
        'email',
        {
          type: stringType,
          value: 'example@gmail.com',
        },
      ],
      [
        'phone',
        {
          type: stringType,
          value: '9196410306',
        },
      ],
    ],
    repeatedFields: [],
    oneOfFields: [],
    mapFields: [],
  };

  const serialized = await serializeProtobuf(messageValue, protoCtx);

  const deserialized = await deserializeProtobuf(serialized, messageTypeName, protoCtx);

  expect(deserialized.tag).toEqual('valid');
  expect(deserialized.value).toStrictEqual(messageValue);
});

test('deserializeProtobuf() should try to return the object when failing', async () => {
  const filepaths = [resolvePath('test3.proto')];
  const protoCtx = await buildContext(filepaths);

  const smallUserType = protoCtx.types['.test3.SmallUser'] as MessageType;
  const stringType = protoCtx.types['string'] as PrimitiveType;

  const messageValue: MessageValue = {
    type: smallUserType,
    singleFields: [
      [
        'firstName',
        {
          type: stringType,
          value: 'test_user',
        },
      ],
    ],
    repeatedFields: [],
    oneOfFields: [],
    mapFields: [],
  };

  const serialized = await serializeProtobuf(messageValue, protoCtx);

  const res = await deserializeProtobuf(serialized, '.test3.User', protoCtx);

  if (res.tag === 'invalid') {
    expect(res.value).toBe(JSON.stringify({ firstName: 'test_user' }, null, 2));
    expect(res.error).toBeDefined();
  } else {
    expect(res.tag).toBe('invalid');
  }
});
