import { app, dialog, ipcMain } from 'electron';
import fs from 'fs';
import _ from 'lodash';
import ipcChannel from '../ipc_channels';
import { explorerCache } from './utils';
import { createDataFolder, DATA_FOLDER_NAME, getMostRecent, open, save, saveBackup } from './persistence';
import { S3Service } from '../s3';
import path from 'path';
import { sendToWindow } from './index';
import { RequestDescriptor } from '../core/http_client/request';
import { makeRequest } from '../core/http_client/client';
import { ProtoCtx } from '../core/protobuf/protobuf';
import { CacheQueryResponse, CacheRequestBuilder } from '../core/cache';
import protobuf from 'protobufjs';
import { buildContext } from '../core/protobuf/protoParser';

const caches: { [key: string]: any } = {};

function s3BucketLocation(env: string) {
  return `ramp-optimization-${env}-us-east-1/entities_data`;
}

function protoTmpFileLocation(name: string) {
  return `ut-wf-protobuf/${name}.proto`;
}

async function loadCache(dataDir: string, cacheName: string, env: string) {
  const s3: S3Service = new S3Service();
  try {
    const tmpFileName = path.join(dataDir, protoTmpFileLocation(cacheName));
    const root = new protobuf.Root();
    await root.load(tmpFileName);
    const ctx = await buildContext([tmpFileName]);
    console.log(`Loading Cache ${cacheName}`);
    const s3Object = await s3.getObject(s3BucketLocation(env), `${cacheName}`);
    const rootMessage = root.lookupType(cacheName);
    const cache = rootMessage.decode(s3Object.Body as Uint8Array).toJSON();
    _.set(caches, `${env}.${cacheName}`, cache);
    return cache;
  } catch (e) {}
}
function scheduleRefreshCache(dataDir: string, cacheName: string, env: string) {
  setInterval(async () => {
    await loadCache(dataDir, cacheName, env);
  }, 600000);
}
export async function initializeEvents(): Promise<void> {
  const dataDir = path.join(app.getPath('userData'), DATA_FOLDER_NAME);
  const s3: S3Service = new S3Service();
  console.log('Initializing events1');

  console.log('data directory: ' + dataDir);

  try {
    await createDataFolder(dataDir);

    console.log('Made sure datadir exists');

    ipcMain.on(ipcChannel.SAVE, (event, args) => {
      if (args[0]) {
        console.log('Saving...');
        saveBackup(dataDir, args[0]);
      }
    });

    ipcMain.on(ipcChannel.LOAD_MOST_RECENT, async event => {
      console.log('Loading most recent state...');
      try {
        const mostRecent = await getMostRecent(dataDir);
        console.log('Done loading most recent state...');
        event.reply(ipcChannel.LOAD_MOST_RECENT, [mostRecent]);
      } catch (err) {
        event.reply(ipcChannel.LOAD_MOST_RECENT, [null]);
      }
    });

    ipcMain.on(ipcChannel.SEND_REQUEST, async (event, args) => {
      const nonce: number = args[0];
      const rd: RequestDescriptor = args[1];
      const ctx: ProtoCtx = args[2];
      console.log(`Making request with nonce: ${nonce}`);
      await makeRequest(rd, ctx)
        .then(r => event.reply(ipcChannel.REQUEST_SUCCESS, [nonce, r]))
        .catch(e => event.reply(ipcChannel.REQUEST_FAILURE, [nonce, e]));
    });

    ipcMain.on(ipcChannel.EXPORT_COLLECTION, async (event, args) => {
      const [name, data] = args;

      const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: `${name}.json`,
        properties: ['createDirectory', 'showOverwriteConfirmation'],
      });

      if (canceled) {
        event.reply(ipcChannel.EXPORT_CANCELLED);
      } else if (filePath) {
        try {
          await save(filePath, data);
          event.reply(ipcChannel.EXPORT_SUCCESS);
        } catch (e) {
          event.reply(ipcChannel.EXPORT_ERROR, [e]);
        }
      }
    });

    ipcMain.on(ipcChannel.IMPORT_COLLECTION, async event => {
      const path = dialog.showOpenDialogSync({ properties: ['openFile'] });
      if (!path) {
        event.reply(ipcChannel.IMPORT_CANCELLED);
      } else {
        try {
          const data = await open(path[0]);
          event.reply(ipcChannel.IMPORT_SUCCESS, [data]);
        } catch (e) {
          event.reply(ipcChannel.IMPORT_ERROR, [e]);
        }
      }
    });

    ipcMain.on(ipcChannel.SEND_CACHE_REQUEST, async (event, args) => {
      const nonce: number = args[0];
      const env: string = args[1];
      const cacheName: string = args[2];
      const query: CacheRequestBuilder = args[3];
      console.log(`Query CACHE ${cacheName}`);
      const search = query.search;
      const expectedMessage = _.trimStart(query.expectedMessage, '.');
      try {
        const tmpFileName = path.join(dataDir, protoTmpFileLocation(cacheName));
        const root = new protobuf.Root();
        await root.load(tmpFileName);
        console.log(`Query tmpFileName ${tmpFileName}`);
        const ctx = await buildContext([tmpFileName]);
        console.log(`Query ctx ${JSON.stringify(search)} ${expectedMessage}`);
        const rootMessage = root.lookupType(cacheName);
        const messageType = root.lookupType(expectedMessage);
        // const s3Object = await s3.getObject(s3BucketLocation(env), `${cacheName}`);
        // console.log(`Query data`);
        // const cache = rootMessage.decode(s3Object.Body as Uint8Array).toJSON();
        const cache = _.get(caches, `${env}.${cacheName}`);
        if (!cache) {
          await loadCache(dataDir, cacheName, env);
        }
        let data = _.get(caches, `${env}.${cacheName}`);
        if (expectedMessage !== cacheName) {
          const expectedMessageType = _.find(rootMessage.fields, { type: expectedMessage });
          const propertyName: string = _.get(expectedMessageType, 'name', '');
          data = _.get(cache, propertyName);
        }
        const filtered = explorerCache({ data, search, messageType });
        const result: CacheQueryResponse = {
          protoCtx: ctx,
          data: filtered,
        };
        console.log(`LOAD CACHE Loaded` + cacheName);
        event.reply(ipcChannel.QUERY_CACHE_SUCCESS, [nonce, result]);
      } catch (e) {
        console.log('LOAD CACHE ERR' + e);
        event.reply(ipcChannel.QUERY_CACHE_ERROR, [nonce, e]);
      }
    });

    ipcMain.on(ipcChannel.REGISTER_CACHE, async (event, args) => {
      console.log('REGISTER_CACHE');
      const nonce: number = args[0];
      const env: string = args[1];
      const cacheName: string = args[2];
      console.log(`REGISTER_CACHE CACHE ${cacheName}`);
      try {
        const s3Object = await s3.getObject(s3BucketLocation(env), `${cacheName}.proto`);
        const tmpFileName = path.join(dataDir, protoTmpFileLocation(cacheName));
        fs.writeFileSync(tmpFileName, s3Object.Body, {});
        const root = new protobuf.Root();
        await root.load(tmpFileName);
        const ctx = await buildContext([tmpFileName]);
        scheduleRefreshCache(dataDir, cacheName, env);
        event.reply(ipcChannel.REGISTER_CACHE_SUCCESS, [nonce, ctx]);
      } catch (e) {
        console.log('REGISTER_CACHE' + e);
        event.reply(ipcChannel.REGISTER_CACHE_ERROR, [nonce, e]);
      }
    });
  } catch (err) {
    sendToWindow(ipcChannel.MAIN_ERROR, [err]);
  }
}
