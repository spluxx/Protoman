import { ipcMain, app, dialog } from 'electron';
import ipcChannel from '../ipc_channels';
import { save, DATA_FOLDER_NAME, createDataFolder, cleanup, getMostRecent, saveBackup, open } from './persistence';
import path from 'path';
import { sendToWindow } from './index';
import { RequestDescriptor } from '../core/http_client/request';
import { makeRequest } from '../core/http_client/client';
import { ProtoCtx } from '../core/protobuf/protobuf';

export async function initializeEvents(): Promise<void> {
  const dataDir = path.join(app.getPath('userData'), DATA_FOLDER_NAME);

  console.log('Initializing events');

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

    console.log('Starting cleanup process');
    cleanup(dataDir); // let it run in the background

    console.log('Finished initializing.');
  } catch (err) {
    sendToWindow(ipcChannel.MAIN_ERROR, [err]);
  }
}
