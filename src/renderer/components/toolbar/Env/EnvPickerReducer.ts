import produce from 'immer';
import { AnyAction } from 'redux';
import { AppState } from '../../../models/AppState';
import { EnvPickerActionTypes, EnvPickerAction } from './EnvPickerActions';

export default function EnvPickerReducer(s: AppState, action: AnyAction): AppState {
  if (EnvPickerActionTypes.includes(action.type)) {
    const a = action as EnvPickerAction;

    switch (a.type) {
      case 'SWITCH_ENV':
        return produce(s, draft => {
          draft.currentEnv = a.newEnvName;
        });
      case 'UPDATE_ENV':
        return produce(s, draft => {
          draft.envList = [...draft.envList.filter(([k]) => k !== a.envName), [a.newEnvName, a.newEnv]];
          draft.currentEnv = a.newEnvName;
        });
      case 'CREATE_ENV':
        return produce(s, draft => {
          draft.envList.push([a.envName, { vars: [] }]);
        });
      case 'DELETE_ENV':
        return produce(s, draft => {
          if (draft.envList.length > 1 && draft.currentEnv === a.envName) {
            draft.envList = draft.envList.filter(([n]) => n !== a.envName);
            draft.currentEnv = draft.envList[0][0];
          }
        });
      default:
        return s;
    }
  }

  return s;
}
