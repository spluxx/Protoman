type SelectRequestMessageName = {
  type: 'SELECT_REQUEST_MESSAGE_NAME';
  name: string;
};

const SELECT_REQUEST_MESSAGE_NAME = 'SELECT_REQUEST_MESSAGE_NAME';

type SelectResponseMessageName = {
  type: 'SELECT_RESPONSE_MESSAGE_NAME';
  name: string;
};

const SELECT_RESPONSE_MESSAGE_NAME = 'SELECT_RESPONSE_MESSAGE_NAME';

export const BodyInputActionTypes = [SELECT_REQUEST_MESSAGE_NAME, SELECT_RESPONSE_MESSAGE_NAME];
export type BodyInputActions = SelectRequestMessageName | SelectResponseMessageName;

export function selectRequestMessageName(name: string): SelectRequestMessageName {
  return {
    type: SELECT_REQUEST_MESSAGE_NAME,
    name,
  };
}

export function selectResponseMessageName(name: string): SelectResponseMessageName {
  return {
    type: SELECT_RESPONSE_MESSAGE_NAME,
    name,
  };
}
