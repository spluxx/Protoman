type SelectResponseMessageName = {
  type: 'SELECT_RESPONSE_MESSAGE_NAME';
  name: string;
};

type SelectResponseMessageOnErrorName = {
  type: 'SELECT_RESPONSE_MESSAGE_ON_ERROR_NAME';
  name: string;
};

const SELECT_RESPONSE_MESSAGE_NAME = 'SELECT_RESPONSE_MESSAGE_NAME';
const SELECT_RESPONSE_MESSAGE_ON_ERROR_NAME = 'SELECT_RESPONSE_MESSAGE_ON_ERROR_NAME';

export const ExpectedBodyInputActionTypes = [SELECT_RESPONSE_MESSAGE_NAME, SELECT_RESPONSE_MESSAGE_ON_ERROR_NAME];
export type ExpectedBodyInputActions = SelectResponseMessageName | SelectResponseMessageOnErrorName;

export function selectResponseMessageName(name: string): SelectResponseMessageName {
  return {
    type: SELECT_RESPONSE_MESSAGE_NAME,
    name,
  };
}

export function selectResponseMessageOnErrorName(name: string): SelectResponseMessageOnErrorName {
  return {
    type: SELECT_RESPONSE_MESSAGE_ON_ERROR_NAME,
    name,
  };
}
