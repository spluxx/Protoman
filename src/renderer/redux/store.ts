import { createStore } from 'redux';
import { AppState } from '../models/AppState';

const initialState: AppState = {
  envList: {
    dev: {
      vars: {
        host: 'http://localhost:3000',
      },
    },
    prod: {
      vars: {
        host: 'https://example.com',
      },
    },
  },
  collections: {
    Yo: {
      protoDefs: [],
      messageNames: [],
      flows: {},
    },
  },
  currentEnv: 'dev',
  currentProtoDefs: [],
  currentMessageNames: [], // just the top-level ones
  currentFlow: {
    requestBuilder: {
      method: 'GET',
      url: '',
      headers: {},
      body: null,
      responseMessageName: null,
    },
    response: null,
  },
};

const store = createStore(s => s || initialState, initialState);

export default store;
