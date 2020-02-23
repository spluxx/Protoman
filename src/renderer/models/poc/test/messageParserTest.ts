import * as assert from 'assert';

import {
  MessageType,
  PrimitiveType,
  EnumType,
  ProtoCtx,
  ProtobufValue,
  PrimitiveValue,
  EnumValue,
  MessageValue,
} from '../../http/body/protobuf';
import protobuf from 'protobufjs';
import { createMessageRecurse } from '../http/serializer';
import { createMessageValue } from '../http/deserializer';

async function verifyJson(messageName: string, path: string, payload: any): Promise<void> {
  const root = await protobuf.load(path);
  const userMessage = root.lookupType(messageName);
  const errMsg = userMessage.verify(payload);
  console.log(errMsg);
  if (errMsg) throw Error(errMsg);
}

export async function testMessageParser(): Promise<void> {
  const stringType: PrimitiveType = {
    tag: 'primitive',
    name: 'string',
    defaultValue: '',
  };

  const sportsType: EnumType = {
    tag: 'enum',
    name: 'Sports',
    options: ['Basketball', 'Baseball', 'Hockey'],
    optionValues: { Basketball: 0, Baseball: 1, Hockey: 2 },
  };

  const smallUserType: MessageType = {
    tag: 'message',
    name: 'SmallUser',
    singleFields: [['first_name', 'string']],
    repeatedFields: [],
    oneOfFields: [],
    mapFields: [],
  };

  const userType: MessageType = {
    tag: 'message',
    name: 'User',
    singleFields: [['first_name', 'string']],
    repeatedFields: [
      ['friend_ids', 'string'],
      ['friends', 'SmallUser'],
    ],
    oneOfFields: [
      [
        'favorite',
        [
          ['sports', 'Sports'],
          ['food', 'string'],
        ],
      ],
    ],
    mapFields: [['properties', ['string', 'string']]],
  };

  const sampleCtx: ProtoCtx = {
    types: {
      string: stringType,
      User: userType,
      SmallUser: smallUserType,
      Sports: sportsType,
    },
  };

  const firstNameValue: PrimitiveValue = {
    type: stringType,
    value: 'Louis',
  };

  const friend1FirstNameValue: PrimitiveValue = {
    type: stringType,
    value: 'Inchan',
  };

  const friend2FirstNameValue: PrimitiveValue = {
    type: stringType,
    value: 'Erie',
  };
  const friend1IdValue: PrimitiveValue = {
    type: stringType,
    value: '16',
  };

  const friend2IdValue: PrimitiveValue = {
    type: stringType,
    value: '18',
  };

  const sportValue: EnumValue = {
    type: sportsType,
    selected: 'Basketball',
  };

  const foodValue: PrimitiveValue = {
    type: stringType,
    value: 'Chicken',
  };

  const mapValue1: PrimitiveValue = {
    type: stringType,
    value: 'Wonju',
  };
  const mapValue2: PrimitiveValue = {
    type: stringType,
    value: 'Boy',
  };

  const mapValue3: PrimitiveValue = {
    type: stringType,
    value: 'Tall',
  };

  const smallUser1Value: MessageValue = {
    type: userType,
    singleFields: [['first_name', friend1FirstNameValue]],
    repeatedFields: [],
    oneOfFields: [],
    mapFields: [],
  };

  const smallUser2Value: MessageValue = {
    type: userType,
    singleFields: [['first_name', friend2FirstNameValue]],
    repeatedFields: [],
    oneOfFields: [],
    mapFields: [],
  };

  const userValue: MessageValue = {
    type: userType,
    singleFields: [['first_name', firstNameValue]],
    repeatedFields: [
      ['friend_ids', [friend1IdValue, friend2IdValue]],
      ['friends', [smallUser1Value, smallUser2Value]],
    ],
    oneOfFields: [['favorite', ['sports', sportValue]]],
    mapFields: [
      [
        'properties',
        [
          ['city', mapValue1],
          ['sex', mapValue2],
          ['height', mapValue3],
        ],
      ],
    ],
  };

  console.log('Testing for Message Parser starting');

  console.log('message value to json');
  const jsonObject = createMessageRecurse(userValue);
  assert.deepEqual(jsonObject, {
    first_name: 'Louis',
    favorite: {
      sports: 'Basketball',
    },
    friend_ids: ['16', '18'],
    friends: [{ first_name: 'Inchan' }, { first_name: 'Erie' }],
    properties: { city: 'Wonju', sex: 'Boy', height: 'Tall' },
  });

  console.log('verify json');
  const result = await verifyJson('test3.User', './test3.proto', jsonObject);

  console.log('json to message value');
  const messageValue = createMessageValue(userType, jsonObject, sampleCtx);
  console.log(messageValue);
}
