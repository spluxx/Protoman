import { ipcMain, app, dialog } from 'electron';
import fs from 'fs';
import ipcChannel from '../ipc_channels';
import { save, DATA_FOLDER_NAME, createDataFolder, cleanup, getMostRecent, saveBackup, open } from './persistence';
import { S3Service } from '../s3';
import path from 'path';
import { sendToWindow } from './index';
import { RequestDescriptor } from '../core/http_client/request';
import { makeRequest } from '../core/http_client/client';
import { ProtoCtx, CacheResult, CachesResult } from '../core/protobuf/protobuf';
import protobuf, { Type } from 'protobufjs';

function s3BucketLocation(env: string) {
  return `ramp-optimization-${env}-us-east-1/entities_data`;
}

function protoTmpFileLocation(name: string) {
  return `ut-wf-protobuf/${name}.proto`;
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
    console.log('register load cache');
    ipcMain.on(ipcChannel.READ_CACHE, async (event, env) => {
      console.log('LOAD CACHE');
      console.log(env);
      try {
        const root = new protobuf.Root();
        const caches: CachesResult = await ['Supply', 'Common', 'Demand'].reduce(
          async (prev: Promise<CachesResult>, name: string) => {
            const caches: CachesResult = await prev;
            console.log(`LOAD CACHE ${name}` + caches);
            const s3Object = await s3.getObject(s3BucketLocation(env), `${name}.proto`);
            const tmpFileName = path.join(dataDir, protoTmpFileLocation(name));
            fs.writeFileSync(tmpFileName, s3Object.Body, {});
            //await root.load(tmpFileName);
            const data = await s3.getObject(s3BucketLocation(env), `${name}`);
            caches[name] = {
              name,
              protoFilePaths: [tmpFileName],
              data: data.Body as Uint8Array,
            };
            return Promise.resolve(caches);
            // const message = root.lookupType(`${name}`);
            // const decoded = message.decode(protobuf.Reader.create(data.Body as Uint8Array));
            // return Promise.resolve(decoded);
          },
          Promise.resolve({}),
        );
        // const [supplyDef, commonDef, demandDef] = await Promise.all([
        //   s3.getObject(`ramp-optimization-${env}-us-east-1/entities_data`, 'Supply.proto'),
        //   s3.getObject(`ramp-optimization-${env}-us-east-1/entities_data`, 'Common.proto'),
        //   s3.getObject(`ramp-optimization-${env}-us-east-1/entities_data`, 'Demand.proto')
        // ]);
        //
        // s3.getObject(`ramp-optimization-${env}-us-east-1/entities_data`, 'Common'),
        // const tmpFileName = path.join(dataDir, `ut-wf-protobuf/Common.proto`);
        // fs.writeFileSync(tmpFileName, protoDef.Body, {});
        //
        // await root.load(tmpFileName);
        // const message = root.lookupType('Common');
        // const decoded = message.decode(protobuf.Reader.create(data.Body as Uint8Array));
        // const cache = decoded.toJSON();
        console.log(`LOAD CACHE Loaded` + caches);
        event.reply(ipcChannel.READ_CACHE_SUCCESS, caches);
      } catch (e) {
        console.log('LOAD CACHE ERR' + e);
        event.reply(ipcChannel.READ_CACHE_FAILURE, e);
      }
    });
    console.log('Starting cleanup process');
    cleanup(dataDir); // let it run in the background

    console.log('Finished initializing.');
  } catch (err) {
    sendToWindow(ipcChannel.MAIN_ERROR, [err]);
  }
}
