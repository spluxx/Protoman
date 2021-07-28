import { app, BrowserWindow, Menu, Rectangle, screen } from 'electron';
const Store = require('electron-store');
import path from 'path';
import makeMenu from './menu';
import { initializeEvents } from './events';
import { checkUpdateAndNotify } from './notification';

let window: BrowserWindow;

const WIDTH_RATIO = 0.8;
const ASPECT_RATIO = 10 / 16;
const config = new Store()

async function createWindow(): Promise<void> {
  const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
  let bounds = config.get('winBounds');
  //default value
  let width = screenWidth * WIDTH_RATIO;
  let height = screenWidth * WIDTH_RATIO * ASPECT_RATIO;
  //if some value
  if (bounds != undefined) {
    width = bounds.width;
    height = bounds.height;
  }
  console.log("saved bounds ", bounds);
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
    console.log("closing the window");
    console.log("save window bounds");
    config.set('winBounds', window.getBounds())
  })
  checkUpdateAndNotify(window);
}

console.log('MAIN PROCESS STARTED');

export function sendToWindow(channel: string, args: unknown[]): void {
  window.webContents.send(channel, args);
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
