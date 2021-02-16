import fetch from 'node-fetch';
import electron, { BrowserWindow } from 'electron';

const RELEASE_URL = 'https://api.github.com/repos/spluxx/protoman/releases';
const ICON_URL = 'https://raw.githubusercontent.com/spluxx/Protoman/master/assets/icon.png';

// couldn't get https://github.com/pd4d10/electron-update-notification to work... :/
export async function checkUpdateAndNotify(window: BrowserWindow): Promise<void> {
  // if (process.env.NODE_ENV === 'development') return;
  //
  // try {
  //   const res = await fetch(RELEASE_URL);
  //   const json = await res.json();
  //   const latest = json[0];
  //   if (!latest) return;
  //
  //   // Remove leading v
  //
  //   const latestVersion = latest.tag_name.startsWith('v') ? latest.tag_name.slice(1) : latest.tag_name;
  //
  //   if (latestVersion != electron.app.getVersion()) {
  //     const iconBuf = await fetch(ICON_URL).then(r => r.buffer());
  //
  //     const selection = await electron.dialog.showMessageBox(window, {
  //       type: 'none',
  //       icon: electron.nativeImage.createFromBuffer(iconBuf),
  //       message: `v${latestVersion} available!`,
  //       buttons: ['Download', 'Later'],
  //     });
  //
  //     if (selection.response === 0) {
  //       electron.shell.openExternal(latest.html_url);
  //     }
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
}
