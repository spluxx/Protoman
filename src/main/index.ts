import { app, BrowserWindow, Menu, screen } from 'electron';
import path from 'path';
import makeMenu from './menu';
import { initializeEvents } from './events';

let window: BrowserWindow;

const WIDTH_RATIO = 0.75;
const ASPECT_RATIO = 3 / 5;

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
}

console.log('MAIN PROCESS STARTED');

export function sendToWindow(channel: string, args: unknown[]): void {
  window.webContents.send(channel, args);
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
