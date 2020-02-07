import { Menu } from 'electron';

function makeMenu(): Menu {
  return Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit ProtoMan',
          role: 'quit',
        },
      ],
    },
  ]);
}

export default makeMenu;
