import produce from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../../models/AppState';
import { NodeEnvPickerActionTypes, NodeEnvPickerAction } from './NodeEnvPickerActions';

export default function NodeEnvPickerReducer(s: AppState, action: AnyAction): AppState {
  if (NodeEnvPickerActionTypes.includes(action.type)) {
    const a = action as NodeEnvPickerAction;

    switch (a.type) {
      case 'SWITCH_NODE_ENV':
        return produce(s, draft => {
          draft.currentNodeEnv = a.value;
        });
      default:
        return s;
    }
  }

  return s;
}
