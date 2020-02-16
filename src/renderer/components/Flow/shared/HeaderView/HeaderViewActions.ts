type AddHeaderAction = {
  type: 'CREATE_HEADER';
};

type DeleteHeaderAction = {
  type: 'DELETE_HEADER';
  idx: number;
};

type ChangeHeaderNameAction = {
  type: 'CHANGE_HEADER_NAME';
  idx: number;
  name: string;
};

type ChangeHeaderValueAction = {
  type: 'CHANGE_HEADER_VALUE';
  idx: number;
  value: string;
};

export const HeaderViewActionTypes = ['CREATE_HEADER', 'DELETE_HEADER', 'CHANGE_HEADER_NAME', 'CHANGE_HEADER_VALUE'];
export type HeaderViewAction = AddHeaderAction | DeleteHeaderAction | ChangeHeaderNameAction | ChangeHeaderValueAction;

export function createHeader(): AddHeaderAction {
  return {
    type: 'CREATE_HEADER',
  };
}

export function deleteHeader(idx: number): DeleteHeaderAction {
  return {
    type: 'DELETE_HEADER',
    idx,
  };
}

export function changeHeaderName(idx: number, name: string): ChangeHeaderNameAction {
  return {
    type: 'CHANGE_HEADER_NAME',
    idx,
    name,
  };
}

export function changeHeaderValue(idx: number, value: string): ChangeHeaderValueAction {
  return {
    type: 'CHANGE_HEADER_VALUE',
    idx,
    value,
  };
}
