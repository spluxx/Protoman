type SelectResponseMessageName = {
  type: 'SELECT_RESPONSE_MESSAGE_NAME';
  name: string;
};

const SELECT_RESPONSE_MESSAGE_NAME = 'SELECT_RESPONSE_MESSAGE_NAME';

export const ExpectedBodyInputActionTypes = [SELECT_RESPONSE_MESSAGE_NAME];
export type ExpectedBodyInputActions = SelectResponseMessageName;

export function selectResponseMessageName(name: string): SelectResponseMessageName {
  return {
    type: SELECT_RESPONSE_MESSAGE_NAME,
    name,
  };
}
