import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import makeMenu from './menu';
import { initializeEvents } from './events';

let window: BrowserWindow;

async function createWindow(): Promise<void> {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  initializeEvents();
  Menu.setApplicationMenu(makeMenu());
  window.maximize();
  window.loadFile(path.join(__dirname, 'index.html'));
}

export function sendToWindow(channel: string, args: any[]): void {
  window.webContents.send(channel, args);
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
