/* eslint-disable @typescript-eslint/no-use-before-define */
import { ProtobufValue, MessageValue, PrimitiveValue } from './protobuf';

type Proc = (s: string | null) => string | null;

function applyToProto(v: ProtobufValue, proc: Proc): ProtobufValue {
  switch (v.type.tag) {
    case 'message':
      return applyToProtoMessage(v as MessageValue, proc);
    case 'primitive':
      return applyToProtoPrimitive(v as PrimitiveValue, proc);
    case 'enum':
      return v;
  }
}

export function applyToProtoMessage(v: MessageValue, proc: Proc): MessageValue {
  const singleFields = v.singleFields
    .filter(([_, v]) => !!v?.type?.tag)
    .map(([name, v]): [string, ProtobufValue] => [name, applyToProto(v, proc)]);
  const repeatedFields = v.repeatedFields.map(([name, vs]): [string, ProtobufValue[]] => [
    name,
    vs.filter(val => !!val?.type?.tag).map(v => applyToProto(v, proc)),
  ]);
  const oneOfFields = v.oneOfFields.map(([name, [sub, v]]): [string, [string, ProtobufValue]] => [
    name,
    [sub, applyToProto(v, proc)],
  ]);
  const mapFields = v.mapFields.map(([name, kvPairs]): [string, [string, ProtobufValue][]] => [
    name,
    kvPairs.map(([k, v]) => [k, applyToProto(v, proc)]),
  ]);

  return {
    type: v.type,
    singleFields,
    repeatedFields,
    oneOfFields,
    mapFields,
  };
}

function applyToProtoPrimitive(v: PrimitiveValue, proc: Proc): PrimitiveValue {
  const { type, value } = v;
  return {
    type,
    value: proc(value),
  };
}
