import { Collection } from '../../models/Collection';
import { ipcRenderer } from '../..';
import ipcChannels from '../../../ipc_channels';
import produce from 'immer';
import { procCol } from '../../redux/store';

export async function exportCollection(name: string, collection: Collection): Promise<void> {
  const exportedCollection = produce(collection, procCol);
  const serialized = new TextEncoder().encode(JSON.stringify(exportedCollection));
  ipcRenderer.send(ipcChannels.EXPORT_COLLECTION, [name, serialized]);
}
