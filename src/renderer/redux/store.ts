import { createStore, applyMiddleware, Store } from 'redux';
import AppReducer from './AppReducer';
import { AppState } from '../models/AppState';
import produce, { Draft } from 'immer';
import { Collection } from '../models/Collection';
import { Cache } from '../../core/Cache';
import { Env } from '../models/Env';
import thunk from 'redux-thunk';
import { getByKey, getEntryByKey } from '../utils/utils';
import { Flow } from '../models/flow';
import { ProtoCtx } from '../../core/protobuf/protobuf';
const DEFAULT_FLOW_NAME = 'Request1';
const DEFAULT_COLLECTION_NAME = 'Collection1';
const DEFAULT_ENV_NAME = 'EnvVars1';
const STAGING = 'staging';
const INTEGRATION = 'integration';
const PRODUCTION = 'production';
const DEFAULT_NODE_ENV_NAME = STAGING;
const DEFAULT_CACHE_NAME = 'Demand';

export function createDefaultFlow(): Draft<Flow> {
  return {
    requestBuilder: {
      method: 'GET',
      url: '',
      headers: [],
      bodyType: 'none',
      bodies: {
        none: undefined,
        protobuf: undefined,
      },
      expectedProtobufMsg: undefined,
    },
    requestStatus: 'default',
    requestError: undefined,
    response: undefined,
  };
}

export function createDefaultProtoCtx(): Draft<ProtoCtx> {
  return {
    types: {},
    descriptorJson: '{}',
  };
}

export function createDefaultCollection(): Draft<Collection> {
  return {
    protoFilepaths: [],
    buildStatus: 'default',
    buildError: undefined,
    protoCtx: createDefaultProtoCtx(),
    messageNames: [],
    flows: [[DEFAULT_FLOW_NAME, createDefaultFlow()]],
  };
}

export function createDefaultCache(): Draft<Cache> {
  return {
    requestBuilder: {
      search: {},
      limit: 100,
      expectedMessage: '',
    },
    messageNames: [],
    protoCtx: undefined,
    cacheRecency: undefined,
    requestStatus: 'default',
    requestError: undefined,
    responseDescriptor: undefined,
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
    nodeEnvList: [INTEGRATION, STAGING, PRODUCTION],
    currentNodeEnv: DEFAULT_NODE_ENV_NAME,
    caches: [[DEFAULT_CACHE_NAME, createDefaultCache()]],
    collections: [[DEFAULT_COLLECTION_NAME, createDefaultCollection()]],
    currentCollection: DEFAULT_COLLECTION_NAME,
    currentCacheName: DEFAULT_CACHE_NAME,
    currentFlow: DEFAULT_FLOW_NAME,
    openCollections: [DEFAULT_COLLECTION_NAME],
    fmOpenCollection: undefined,
  };
}

/** Selectors */

export function selectCurrentCol(s: AppState): Collection | undefined {
  return getByKey(s.collections, s.currentCollection);
}

export function selectCurrentFlow(s: AppState): Flow | undefined {
  return getByKey(selectCurrentCol(s)?.flows, s.currentFlow);
}

export function selectCurrentEnv(s: AppState): Env | undefined {
  return getByKey(s.envList, s.currentEnv);
}

export function selectCurrentColWithName(s: AppState): [string, Collection] | undefined {
  return getEntryByKey(s.collections, s.currentCollection);
}

export function selectCurrentCacheWithName(s: AppState): [string, Cache] | undefined {
  return getEntryByKey(s.caches, s.currentCacheName);
}

export function selectCurrentFlowWithName(s: AppState): [string, Flow] | undefined {
  return getEntryByKey(selectCurrentCol(s)?.flows, s.currentFlow);
}

export function selectCurrentEnvWithName(s: AppState): [string, Env] | undefined {
  return getEntryByKey(s.envList, s.currentEnv);
}

export function selectColNames(s: AppState): string[] {
  return s.collections.map(([n]) => n);
}

export function selectEnvNames(s: AppState): string[] {
  return s.envList.map(([n]) => n);
}

/** Serialize/Deserialize */
function procFlow(flow: Draft<Flow>): Draft<Flow> {
  flow.requestError = undefined;
  flow.requestStatus = 'default';
  flow.response = undefined;
  return flow;
}

export function procCol(collection: Draft<Collection>): Draft<Collection> {
  collection.buildError = undefined;
  collection.buildStatus = 'default';
  collection.flows = collection.flows.map(([fn, f]) => [fn, procFlow(f)]);
  return collection;
}

export function procCache(cache: Draft<Cache>): Draft<Cache> {
  cache.responseDescriptor = undefined;
  cache.requestStatus = 'default';
  cache.cacheRecency = undefined;
  cache.requestBuilder = {
    search: {},
    limit: 100,
    expectedMessage: '',
  };
  return cache;
}
function preprocess(appState: AppState): AppState {
  return produce(appState, draft => {
    draft.collections = draft.collections.map(([cn, c]) => [cn, procCol(c)]);
    draft.fmOpenCollection = undefined;
    draft.caches = draft.caches.map(([cn, c]) => [cn, procCache(c)]);
    return draft;
  });
}

function serialize(appState: AppState): Uint8Array {
  const json = JSON.stringify(preprocess(appState), null, 0);
  return new TextEncoder().encode(json);
}

function deserialize(buf: Uint8Array): AppState {
  return JSON.parse(new TextDecoder().decode(buf));
}

export function makeStore(loaded: Uint8Array | null): Store {
  const initialState = loaded ? deserialize(loaded) : createDefaultAppState();

  return createStore((s, a) => AppReducer(s || initialState, a), initialState, applyMiddleware(thunk));
}

export function dumpStore(store: Store): Uint8Array {
  return serialize(store.getState());
}
