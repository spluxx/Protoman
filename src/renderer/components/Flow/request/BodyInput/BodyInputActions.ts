type SelectMessageName = {
  type: 'SELECT_MESSAGE_NAME';
  name: string;
};

const SELECT_MESSAGE_NAME = 'SELECT_MESSAGE_NAME';

export const BodyInputActionTypes = [SELECT_MESSAGE_NAME];
export type BodyInputActions = SelectMessageName;

export function selectMessageName(name: string): SelectMessageName {
  return {
    type: SELECT_MESSAGE_NAME,
    name,
  };
}
