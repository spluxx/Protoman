import { app, BrowserWindow } from 'electron';

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
  window.loadFile('./index.html');
}

app.allowRendererProcessReuse = true;

app.on('ready', createWindow);
