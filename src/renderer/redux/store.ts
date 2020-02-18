import { createStore } from 'redux';
import { produce } from 'immer';
import { AppState } from '../models/AppState';
import {
  typeToDefaultValue,
  MessageType,
  PrimitiveType,
  ProtoCtx,
  EnumType,
  MessageValue,
} from '../models/http/body/protobuf';
import AppReducer from './AppReducer';

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
  fields: [['first_name', 'string']],
  repeatedFields: [],
  oneOfFields: [],
  mapFields: [],
};

const userType: MessageType = {
  tag: 'message',
  name: 'User',
  fields: [['first_name', 'string']],
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

const sampleBody = produce(typeToDefaultValue(userType, sampleCtx) as MessageValue, draft => {
  draft.repeatedFields[0][1] = [
    {
      type: stringType,
      value: '1234',
    },
    {
      type: stringType,
      value: '294',
    },
  ];

  draft.repeatedFields[1][1] = [
    {
      //@ts-ignore
      type: smallUserType,
      fields: [
        [
          'first_name',
          {
            type: stringType,
            value: 'Inchan',
          },
        ],
      ],
      repeatedFields: [],
      oneOfFields: [],
      mapFields: [],
    },
    {
      //@ts-ignore
      type: smallUserType,
      fields: [
        [
          'first_name',
          {
            type: stringType,
            value: 'Louis',
          },
        ],
      ],
      repeatedFields: [],
      oneOfFields: [],
      mapFields: [],
    },
  ];

  draft.mapFields[0][1] = [
    [
      'key',
      {
        type: stringType,
        value: 'value',
      },
    ],
    [
      'some_other_key',
      {
        type: stringType,
        value: 'some_long_long_long_long_long_long_long_value',
      },
    ],
  ];
});

const initialState: AppState = {
  envList: [
    [
      'dev',
      {
        vars: [['host', 'http://localhost:3000']],
      },
    ],
    [
      'prod',
      {
        vars: [['host', 'https://example.com']],
      },
    ],
  ],
  currentEnv: 'dev',

  collections: [
    [
      'Yo',
      {
        protoDefs: [],
        protoCtx: sampleCtx,
        messageNames: ['User'],
        flows: [
          [
            'sample request',
            {
              requestBuilder: {
                method: 'GET',
                url: '',
                headers: [['content-type', 'application/json']],
                body: sampleBody,
                responseMessageName: undefined,
              },
              response: undefined,
            },
          ],
        ],
      },
    ],
  ],
  openCollections: ['Yo'],
  currentCollection: 'Yo',
  currentFlow: 'sample request',
};

const store = createStore((s, a) => AppReducer(s || initialState, a), initialState);

export default store;
