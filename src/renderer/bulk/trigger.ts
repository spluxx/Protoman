import produce from 'immer';
import { Collection } from '../models/Collection';
import { procCol } from '../redux/store';
import ipcChannels from '../../ipc_channels';
import { ipcRenderer } from '..';

export async function exportCollection(name: string, collection: Collection): Promise<void> {
  const exportedCollection = produce(collection, procCol);
  const serialized = new TextEncoder().encode(JSON.stringify(exportedCollection));
  ipcRenderer.send(ipcChannels.EXPORT_COLLECTION, [name, serialized]);
}

export function importCollection(): void {
  ipcRenderer.send(ipcChannels.IMPORT_COLLECTION);
}
