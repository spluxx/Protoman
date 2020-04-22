/* eslint-disable @typescript-eslint/camelcase */
import { MessageType, PrimitiveType, EnumType, ProtoCtx, PrimitiveValue, EnumValue, MessageValue } from '../protobuf';

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

export const userType: MessageType = {
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

export const sampleCtx: ProtoCtx = {
  types: {
    string: stringType,
    User: userType,
    SmallUser: smallUserType,
    Sports: sportsType,
  },
  descriptorJson: '{}',
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
  type: smallUserType,
  singleFields: [['first_name', friend1FirstNameValue]],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const smallUser2Value: MessageValue = {
  type: smallUserType,
  singleFields: [['first_name', friend2FirstNameValue]],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

export const userValue: MessageValue = {
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

export const test3UserExpectedJson = {
  first_name: 'Louis',
  sports: 0,
  friend_ids: ['16', '18'],
  friends: [{ first_name: 'Inchan' }, { first_name: 'Erie' }],
  properties: { city: 'Wonju', sex: 'Boy', height: 'Tall' },
};
