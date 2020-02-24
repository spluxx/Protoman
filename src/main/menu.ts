import { Menu, app } from 'electron';
import { triggerSave } from './events';
const isMac = process.platform === 'darwin';

export function makeMenu(): Menu {
  return Menu.buildFromTemplate([
    ...((isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []) as any), // idk why but typescript trips up with this
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          click: triggerSave,
          accelerator: 'CommandOrControl+S',
        },
        ...(isMac ? [] : [{ role: 'quit' }]),
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]);
}

export default makeMenu;
