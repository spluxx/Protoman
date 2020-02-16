import { Env } from '../../../models/Env';
import { Draft } from 'immer';

type SwitchEnvAction = {
  type: 'SWITCH_ENV';
  newEnvName: string;
};

const SWITCH_ENV = 'SWITCH_ENV';

type UpdateEnvAction = {
  type: 'UPDATE_ENV';
  envName: string;
  newEnvName: string;
  newEnv: Draft<Env>;
};

const UPDATE_ENV = 'UPDATE_ENV';

type CreateEnvAction = {
  type: 'CREATE_ENV';
  envName: string;
};

const CREATE_ENV = 'CREATE_ENV';

type DeleteEnvAction = {
  type: 'DELETE_ENV';
  envName: string;
};

const DELETE_ENV = 'DELETE_ENV';

export const EnvPickerActionTypes = [SWITCH_ENV, UPDATE_ENV, CREATE_ENV, DELETE_ENV];
export type EnvPickerAction = SwitchEnvAction | UpdateEnvAction | CreateEnvAction | DeleteEnvAction;

export function switchEnv(newEnvName: string): SwitchEnvAction {
  return {
    type: SWITCH_ENV,
    newEnvName,
  };
}

export function updateEnv(envName: string, newEnvName: string, newEnv: Draft<Env>): UpdateEnvAction {
  return {
    type: UPDATE_ENV,
    envName,
    newEnvName,
    newEnv,
  };
}

export function createEnv(envName: string): CreateEnvAction {
  return {
    type: CREATE_ENV,
    envName,
  };
}

export function deleteEnv(envName: string): DeleteEnvAction {
  return {
    type: DELETE_ENV,
    envName,
  };
}
