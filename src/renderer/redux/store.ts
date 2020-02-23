import { createStore, applyMiddleware } from 'redux';
import AppReducer from './AppReducer';
import { AppState } from '../models/AppState';
import { Draft } from 'immer';
import { Flow } from '../models/http/flow';
import { Collection } from '../models/Collection';
import { Env } from '../models/Env';
import thunk from 'redux-thunk';

const DEFAULT_FLOW_NAME = 'flow1';
const DEFAULT_COLLECTION_NAME = 'collection1';
const DEFAULT_ENV_NAME = 'env1';

export function createDefaultFlow(): Draft<Flow> {
  return {
    requestBuilder: {
      method: 'GET',
      url: '',
      headers: [],
      body: undefined,
      responseMessageName: undefined,
    },
    requestStatus: 'default',
    requestError: undefined,
    response: undefined,
  };
}

export function createDefaultCollection(): Draft<Collection> {
  return {
    protoFilepaths: [],
    buildStatus: 'default',
    buildError: undefined,
    protoCtx: {
      types: {},
      origin: {},
    },
    messageNames: [],
    flows: [[DEFAULT_FLOW_NAME, createDefaultFlow()]],
  };
}

function createDefaultEnv(): Draft<Env> {
  return {
    vars: [],
  };
}

function createDefaultAppState(): Draft<AppState> {
  return {
    envList: [[DEFAULT_ENV_NAME, createDefaultEnv()]],
    currentEnv: DEFAULT_ENV_NAME,
    collections: [[DEFAULT_COLLECTION_NAME, createDefaultCollection()]],
    currentCollection: DEFAULT_COLLECTION_NAME,
    currentFlow: DEFAULT_FLOW_NAME,
    openCollections: [DEFAULT_COLLECTION_NAME],
  };
}

const initialState: AppState = createDefaultAppState();

const store = createStore((s, a) => AppReducer(s || initialState, a), initialState, applyMiddleware(thunk));

export default store;
