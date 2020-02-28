import { ipcMain, app } from 'electron';
import ipcChannel from '../ipc_channels';
import { save, DATA_FOLDER_NAME, createDataFolder, cleanup, getMostRecent } from './persistence';
import path from 'path';
import { sendToWindow } from './index';

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
        save(dataDir, args[0]);
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

    console.log('Starting cleanup process');
    cleanup(dataDir); // let it run in the background

    console.log('Finished initializing.');
  } catch (err) {
    sendToWindow(ipcChannel.MAIN_ERROR, [err]);
  }
}
