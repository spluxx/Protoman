import { app, BrowserWindow, Menu, screen } from 'electron';
import path from 'path';
import makeMenu from './menu';
import { initializeEvents } from './events';
import { checkUpdateAndNotify } from './notification';

let window: BrowserWindow;

const WIDTH_RATIO = 0.8;
const ASPECT_RATIO = 10 / 16;

async function createWindow(): Promise<void> {
  const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;

  window = new BrowserWindow({
    width: screenWidth * WIDTH_RATIO,
    height: screenWidth * WIDTH_RATIO * ASPECT_RATIO,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  initializeEvents();
  Menu.setApplicationMenu(makeMenu());
  window.loadFile(path.join(__dirname, 'index.html'));

  checkUpdateAndNotify(window);
}

console.log('MAIN PROCESS STARTED');

export function sendToWindow(channel: string, args: unknown[]): void {
  window.webContents.send(channel, args);
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
