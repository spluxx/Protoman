type SelectRequestMessageName = {
  type: 'SELECT_REQUEST_MESSAGE_NAME';
  name: string;
};

const SELECT_REQUEST_MESSAGE_NAME = 'SELECT_REQUEST_MESSAGE_NAME';

type SelectBodyType = {
  type: 'SELECT_BODY_TYPE';
  bodyType: string;
};

const SELECT_BODY_TYPE = 'SELECT_BODY_TYPE';

type JSONBodyChangedType = {
  type: 'JSON_BODY_CHANGED_TYPE';
  bodyValue: string;
};

const JSON_BODY_CHANGED_TYPE = 'JSON_BODY_CHANGED_TYPE';

export const BodyInputActionTypes = [SELECT_REQUEST_MESSAGE_NAME, SELECT_BODY_TYPE, JSON_BODY_CHANGED_TYPE];
export type BodyInputActions = SelectRequestMessageName | SelectBodyType | JSONBodyChangedType;

export function selectRequestMessageName(name: string): SelectRequestMessageName {
  return {
    type: SELECT_REQUEST_MESSAGE_NAME,
    name,
  };
}

export function selectBodyType(bodyType: string): SelectBodyType {
  return {
    type: SELECT_BODY_TYPE,
    bodyType,
  };
}

export function JSONbodyChangedType(bodyValue: string): JSONBodyChangedType {
  return {
    type: JSON_BODY_CHANGED_TYPE,
    bodyValue,
  };
}
