import { ProtobufValue, ProtoCtx } from '../../../../core/protobuf/protobuf';

type ValueChangeAction = {
  type: 'VALUE_CHANGE';
  ctx: ProtoCtx;
  path: string;
  value: string;
};

type FieldChangeAction = {
  type: 'FIELD_CHANGE';
  ctx: ProtoCtx;
  path: string;
  value: string;
};

type EntryAddAction = {
  type: 'ENTRY_ADD';
  ctx: ProtoCtx;
  path: string;
};

type EntryRemoveAction = {
  type: 'ENTRY_REMOVE';
  ctx: ProtoCtx;
  path: string;
};

type AllChangedAction = {
  type: 'ALL_CHANGED';
  ctx: ProtoCtx;
  value: ProtobufValue;
};

export const MessageValueViewActionTypes = ['VALUE_CHANGE', 'FIELD_CHANGE', 'ENTRY_ADD', 'ENTRY_REMOVE', 'ALL_CHANGED'];
export type MessageValueViewAction =
  | ValueChangeAction
  | FieldChangeAction
  | EntryAddAction
  | EntryRemoveAction
  | AllChangedAction;

export function valueChange(path: string, value: string, ctx: ProtoCtx): ValueChangeAction {
  return {
    type: 'VALUE_CHANGE',
    ctx,
    path,
    value,
  };
}

export function fieldChange(path: string, value: string, ctx: ProtoCtx): FieldChangeAction {
  return {
    type: 'FIELD_CHANGE',
    ctx,
    path,
    value,
  };
}

export function entryAdd(path: string, ctx: ProtoCtx): EntryAddAction {
  return {
    type: 'ENTRY_ADD',
    ctx,
    path,
  };
}

export function entryRemove(path: string, ctx: ProtoCtx): EntryRemoveAction {
  return {
    type: 'ENTRY_REMOVE',
    ctx,
    path,
  };
}
export function allChanged(value: ProtobufValue, ctx: ProtoCtx): AllChangedAction {
  return {
    type: 'ALL_CHANGED',
    ctx,
    value,
  };
}
