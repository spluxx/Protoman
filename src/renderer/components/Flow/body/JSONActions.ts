import { ProtoCtx } from '../../../../core/protobuf/protobuf';

type JSONValueChangeAction = {
  type: 'JSON_VALUE_CHANGE';
  ctx: ProtoCtx;
  path: string;
  value: string;
};

export const JSONViewActionTypes = ['JSON_VALUE_CHANGE'];
export type JSONViewAction = JSONValueChangeAction;

export function valueChange(path: string, value: string, ctx: ProtoCtx): JSONValueChangeAction {
  return {
    type: 'JSON_VALUE_CHANGE',
    ctx,
    path,
    value,
  };
}
