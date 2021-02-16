import { initializeApp, ipcRenderer } from './index';
import _ from 'lodash';
import { makeStore } from './redux/store';
import ipcChannels from '../ipc_channels';
import { ResponseDescriptor } from '../core/http_client/response';
import { RequestDescriptor } from '../core/http_client/request';
import { ProtoCtx } from '../core/protobuf/protobuf';
import { CacheQueryResponse, CacheRequestBuilder } from '../core/cache';
import { IpcRenderer } from 'electron';
import { message } from 'antd';
import { validateCollection } from './bulk/utils';
import { importCollection } from './bulk/BulkActions';

import { Store } from 'redux';

function setupListenersWithStore(ipcRenderer: IpcRenderer, store: Store): void {
  ipcRenderer.on(ipcChannels.IMPORT_SUCCESS, (event, [data]) => {
    const obj = JSON.parse(new TextDecoder().decode(data));
    const col = validateCollection(obj);
    if (col) {
      store.dispatch(importCollection(col));
      message.success('Import Success: Make sure the protofile paths are valid');
    } else {
      message.error('Import Error: Invalid collection format');
    }
  });
}
export function setupListeners(ipcRenderer: IpcRenderer): void {
  ipcRenderer.on(ipcChannels.LOAD_MOST_RECENT, (event, args) => {
    console.log('Loaded most recent state ', args);
    if (args[0] !== undefined) {
      console.log('Start store');
      const store = makeStore(args[0]);
      setupListenersWithStore(ipcRenderer, store);
      initializeApp(store);
    }
  });

  ipcRenderer.on(ipcChannels.MAIN_ERROR, (event, args) => {
    console.log('Error from the main process: ', args[0].message);
  });

  ipcRenderer.on(ipcChannels.EXPORT_CANCELLED, () => {
    message.warn('Export cancelled');
  });

  ipcRenderer.on(ipcChannels.EXPORT_SUCCESS, () => {
    message.success('Export success!');
  });

  ipcRenderer.on(ipcChannels.EXPORT_ERROR, (event, [e]) => {
    message.error(`Export error: ${JSON.stringify(e, null, 2)}`, 5);
  });

  ipcRenderer.on(ipcChannels.IMPORT_CANCELLED, () => {
    message.warn('Import cancelled');
  });

  ipcRenderer.on(ipcChannels.IMPORT_ERROR, (event, [e]) => {
    message.error(`Import error: ${JSON.stringify(e, null, 2)}`, 5);
  });
}

function setupResponseListeners(
  nonce: number,
  resolve: (rd: ResponseDescriptor) => void,
  reject: (e: Error) => void,
): void {
  const [onSuccess, onFailure] = [
    (evt: unknown, args: [number, ResponseDescriptor]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.REQUEST_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.REQUEST_SUCCESS, onFailure);
        resolve(args[1]);
      }
    },
    (evt: unknown, args: [number, Error]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.REQUEST_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.REQUEST_SUCCESS, onFailure);
        reject(args[1]);
      }
    },
  ];
  ipcRenderer.on(ipcChannels.REQUEST_SUCCESS, onSuccess);
  ipcRenderer.on(ipcChannels.REQUEST_FAILURE, onFailure);
}
function setupQueryCacheListeners(
  nonce: number,
  resolve: (rd: CacheQueryResponse) => void,
  reject: (e: Error) => void,
): void {
  const [onSuccess, onFailure] = [
    (evt: unknown, args: [number, CacheQueryResponse]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.QUERY_CACHE_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.QUERY_CACHE_SUCCESS, onFailure);
        resolve(args[1]);
      }
    },
    (evt: unknown, args: [number, Error]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.QUERY_CACHE_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.QUERY_CACHE_SUCCESS, onFailure);
        reject(args[1]);
      }
    },
  ];
  ipcRenderer.on(ipcChannels.QUERY_CACHE_SUCCESS, onSuccess);
  ipcRenderer.on(ipcChannels.QUERY_CACHE_ERROR, onFailure);
}

function setupCacheRegisterListeners(nonce: number, resolve: (rd: ProtoCtx) => void, reject: (e: Error) => void): void {
  const [onSuccess, onFailure] = [
    (evt: unknown, args: [number, ProtoCtx]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.REGISTER_CACHE_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.REGISTER_CACHE_SUCCESS, onFailure);
        resolve(args[1]);
      }
    },
    (evt: unknown, args: [number, Error]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.REGISTER_CACHE_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.REGISTER_CACHE_SUCCESS, onFailure);
        reject(args[1]);
      }
    },
  ];
  ipcRenderer.on(ipcChannels.REGISTER_CACHE_SUCCESS, onSuccess);
  ipcRenderer.on(ipcChannels.REGISTER_CACHE_ERROR, onFailure);
}

function setupRefreshCacheListeners(nonce: number, resolve: (rd: Date) => void, reject: (e: Error) => void): void {
  const [onSuccess, onFailure] = [
    (evt: unknown, args: [number, Date]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.REFRESH_CACHE_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.REFRESH_CACHE_SUCCESS, onFailure);
        resolve(args[1]);
      }
    },
    (evt: unknown, args: [number, Error]): void => {
      if (args[0] === nonce) {
        ipcRenderer.removeListener(ipcChannels.REFRESH_CACHE_SUCCESS, onSuccess);
        ipcRenderer.removeListener(ipcChannels.REFRESH_CACHE_SUCCESS, onFailure);
        reject(args[1]);
      }
    },
  ];
  ipcRenderer.on(ipcChannels.REFRESH_CACHE_SUCCESS, onSuccess);
  ipcRenderer.on(ipcChannels.REFRESH_CACHE_ERROR, onFailure);
}
export function makeRequest(request: RequestDescriptor, ctx: ProtoCtx): Promise<ResponseDescriptor> {
  return new Promise((resolve, reject) => {
    const nonce = Math.floor(Math.random() * 1e7);
    setupResponseListeners(nonce, resolve, reject);
    ipcRenderer.send(ipcChannels.SEND_REQUEST, [nonce, request, ctx]);
  });
}
export function registerCache(nodeEnv: string, cacheName: string): Promise<ProtoCtx> {
  return new Promise((resolve, reject) => {
    const nonce = Math.floor(Math.random() * 1e7);
    setupCacheRegisterListeners(nonce, resolve, reject);
    ipcRenderer.send(ipcChannels.REGISTER_CACHE, [nonce, nodeEnv, cacheName]);
  });
}

export function refreshCache(nodeEnv: string, cacheName: string): Promise<Date> {
  return new Promise((resolve, reject) => {
    const nonce = Math.floor(Math.random() * 1e7);
    setupRefreshCacheListeners(nonce, resolve, reject);
    ipcRenderer.send(ipcChannels.REFRESH_CACHE, [nonce, nodeEnv, cacheName]);
  });
}
export function queryCache(
  nodeEnv: string,
  cacheName: string,
  request: CacheRequestBuilder,
): Promise<CacheQueryResponse> {
  return new Promise((resolve, reject) => {
    const nonce = Math.floor(Math.random() * 1e7);
    setupQueryCacheListeners(nonce, resolve, reject);
    ipcRenderer.send(ipcChannels.SEND_CACHE_REQUEST, [nonce, nodeEnv, cacheName, request]);
  });
}
