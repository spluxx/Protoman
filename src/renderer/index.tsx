import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import ipcChannels from '../ipc_channels';
import { makeStore, dumpStore } from './redux/store';
import { Provider } from 'react-redux';
import { Store } from 'redux';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const DEBOUNCE_MS = 2 * 1000; // 2 seconds
let lastJobHandle = 0;

function initialize(store: Store): void {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'),
  );

  store.subscribe(() => {
    clearTimeout(lastJobHandle);
    lastJobHandle = setTimeout(() => {
      ipcRenderer.send(ipcChannels.SAVE, [dumpStore(store)]);
    }, DEBOUNCE_MS);
  });
}

console.log('RENDERER PROCESS STARTED');

ipcRenderer.on(ipcChannels.LOAD_MOST_RECENT, (event, args) => {
  console.log('Loaded most recent state ', args);
  if (args[0] !== undefined) {
    initialize(makeStore(args[0]));
  }
});

ipcRenderer.on(ipcChannels.MAIN_ERROR, (event, args) => {
  console.log('Error from the main process: ', args[0].message);
});

ipcRenderer.send(ipcChannels.LOAD_MOST_RECENT);
