type ChangeFlowNameAction = {
  type: 'CHANGE_FLOW_NAME';
  newName: string;
};

const CHANGE_FLOW_NAME = 'CHANGE_FLOW_NAME';

export type FlowNameViewAction = ChangeFlowNameAction;

export const FlowNameViewActionTypes = [CHANGE_FLOW_NAME];

export function changeFlowName(newName: string): ChangeFlowNameAction {
  return {
    type: CHANGE_FLOW_NAME,
    newName,
  };
}
