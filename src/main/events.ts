import { ipcMain, app } from 'electron';
import ipcChannel from '../ipc_channels';
import { save, DATA_FOLDER_NAME, createDataFolder, cleanup, getMostRecent } from './persistence';
import path from 'path';
import { sendToWindow } from './index';

export async function initializeEvents(): Promise<void> {
  const dataDir = path.join(app.getAppPath(), DATA_FOLDER_NAME);

  await createDataFolder(dataDir);

  ipcMain.on(ipcChannel.SAVE, (event, args) => {
    if (args[0]) {
      save(dataDir, args[0]);
    }
  });

  ipcMain.on(ipcChannel.LOAD_MOST_RECENT, async event => {
    const mostRecent = await getMostRecent(dataDir);
    event.reply(ipcChannel.LOAD_MOST_RECENT, [mostRecent]);
  });

  cleanup(dataDir); // let it run in the background
}

export function triggerSave(): void {
  sendToWindow(ipcChannel.SAVE, []);
}
