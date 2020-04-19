import { Collection } from '../models/Collection';

type ImportCollection = {
  type: 'IMPORT_COLLECTION';
  collection: Collection;
};

const IMPORT_COLLECTION = 'IMPORT_COLLECTION';

export const BulkActionTypes = [IMPORT_COLLECTION];

export type BulkAction = ImportCollection;

export function importCollection(collection: Collection): ImportCollection {
  return {
    type: IMPORT_COLLECTION,
    collection,
  };
}
