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

type SelectBodyType = {
  type: 'SELECT_BODY_TYPE';
  bodyType: string;
};

const SELECT_BODY_TYPE = 'SELECT_BODY_TYPE';

export const BodyInputActionTypes = [SELECT_REQUEST_MESSAGE_NAME, SELECT_RESPONSE_MESSAGE_NAME, SELECT_BODY_TYPE];
export type BodyInputActions = SelectRequestMessageName | SelectResponseMessageName | SelectBodyType;

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

export function selectBodyType(bodyType: string): SelectBodyType {
  return {
    type: SELECT_BODY_TYPE,
    bodyType,
  };
}
