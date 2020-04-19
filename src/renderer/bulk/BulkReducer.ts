import { AppState } from '../models/AppState';
import { AnyAction } from 'redux';
import produce, { Draft } from 'immer';
import { BulkActionTypes, BulkAction } from './BulkActions';
import { Collection } from '../models/Collection';

export default function BulkReducer(s: AppState, action: AnyAction): AppState {
  if (BulkActionTypes.includes(action.type)) {
    const a = action as BulkAction;

    switch (a.type) {
      case 'IMPORT_COLLECTION':
        return produce(s, draft => {
          const names = s.collections.map(([name]) => name);
          const prefix = 'Imported';
          let idx = 1;
          while (names.includes(prefix + idx)) idx++;
          console.log(a.collection);
          draft.collections.push([prefix + idx, a.collection as Draft<Collection>]);
        });
      default:
        return s;
    }
  }

  return s;
}
