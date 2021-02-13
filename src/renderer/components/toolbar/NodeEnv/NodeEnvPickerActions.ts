type SwitchNodeEnvAction = {
  type: 'SWITCH_NODE_ENV';
  value: string;
};

const SWITCH_NODE_ENV = 'SWITCH__NODE_ENV';

export const NodeEnvPickerActionTypes = [SWITCH_NODE_ENV];
export type NodeEnvPickerAction = SwitchNodeEnvAction;

export function switchNodeEnv(value: string): SwitchNodeEnvAction {
  return {
    type: 'SWITCH_NODE_ENV',
    value,
  };
}
