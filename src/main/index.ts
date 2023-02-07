import { app, BrowserWindow, Menu, Rectangle, screen } from 'electron';
import Store from 'electron-store';
import path from 'path';
import makeMenu from './menu';
import { initializeEvents } from './events';
import { checkUpdateAndNotify } from './notification';

console.log('Initializing electron remote');
/* eslint-disable @typescript-eslint/no-var-requires */
require('@electron/remote/main').initialize();

let window: BrowserWindow;

const WIDTH_RATIO = 0.8;
const ASPECT_RATIO = 10 / 16;
const config = new Store<Rectangle>();

async function createWindow(): Promise<void> {
  const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
  const bounds = config.get('winBounds') as Rectangle;
  //default value
  let width = screenWidth * WIDTH_RATIO;
  let height = screenWidth * WIDTH_RATIO * ASPECT_RATIO;
  //if some value
  if (bounds != undefined) {
    width = bounds.width;
    height = bounds.height;
  }
  console.log('saved bounds ', bounds);
  window = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  initializeEvents();
  Menu.setApplicationMenu(makeMenu());
  window.loadFile(path.join(__dirname, 'index.html'));

  window.on('close', () => {
    console.log('closing the window');
    console.log('save window bounds');
    config.set('winBounds', window.getBounds());
  });
  checkUpdateAndNotify(window);
}

console.log('MAIN PROCESS STARTED');

export function sendToWindow(channel: string, args: unknown[]): void {
  window.webContents.send(channel, args);
}

app.on('ready', createWindow);
