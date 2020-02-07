import { app, BrowserWindow, globalShortcut } from 'electron';
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

  if (process.env.NODE_ENV === 'development') {
    globalShortcut.register('F5', function() {
      window.reload();
    });
  }
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
