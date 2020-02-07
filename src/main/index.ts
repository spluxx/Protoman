import { app, BrowserWindow } from 'electron';
import path from 'path';

let window: BrowserWindow;

function createWindow(): void {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  window.maximize();
  window.loadFile(path.join(__dirname, 'index.html'));
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
