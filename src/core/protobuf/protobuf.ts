/* eslint-disable @typescript-eslint/no-use-before-define */

import { Type } from 'protobufjs';
export type ProtobufType = PrimitiveType | MessageType | EnumType;
export type ProtobufValue = PrimitiveValue | MessageValue | EnumValue;
export type FieldName = string;
export type TypeName = string;
export type Field<T> = [FieldName, T];
export type Fields<T> = ReadonlyArray<Field<T>>;
export type Entry<T> = [string, T];
export type Entries<T> = ReadonlyArray<Entry<T>>;
// export type CachesResult = {
//   [key: string]: CacheResult;
// };

export interface ProtoCtx {
  readonly types: { [key: string]: ProtobufType };
  readonly descriptorJson: string;
}

export function typeNameToType(name: TypeName, ctx: ProtoCtx): ProtobufType {
  return ctx.types[name];
}

export interface MessageType {
  readonly tag: 'message';
  readonly name: TypeName; // ex) ProtoModel.Coordinates
  readonly singleFields: Fields<TypeName>;
  readonly repeatedFields: Fields<TypeName>;
  readonly oneOfFields: Fields<Fields<TypeName>>;
  readonly mapFields: Fields<[TypeName, TypeName]>;
}

export interface PrimitiveType {
  readonly tag: 'primitive';
  readonly name: TypeName;
  readonly defaultValue: string;
}

export interface EnumType {
  readonly tag: 'enum';
  readonly name: TypeName;
  readonly options: ReadonlyArray<string>;
  readonly optionValues: Readonly<{ [key: string]: number }>;
}

export interface MessageValue {
  readonly type: MessageType;

  readonly singleFields: Fields<ProtobufValue>;
  readonly repeatedFields: Fields<ReadonlyArray<ProtobufValue>>;
  readonly oneOfFields: Fields<[string, ProtobufValue]>;
  readonly mapFields: Fields<Entries<ProtobufValue>>;
}

export interface PrimitiveValue {
  readonly type: PrimitiveType;

  readonly value: string;
}

export interface EnumValue {
  readonly type: EnumType;

  readonly selected: string;
}

export const typeToDefaultValue = genDefault;

// Helper functions

function genDefault(type: ProtobufType, ctx: ProtoCtx): ProtobufValue {
  switch (type.tag) {
    case 'message':
      return genDefaultMessage(type as MessageType, ctx);
    case 'primitive':
      return genDefaultPrimitive(type as PrimitiveType);
    case 'enum':
      return genDefaultEnum(type as EnumType);
  }
}

function genDefaultMessage(type: MessageType, ctx: ProtoCtx): MessageValue {
  const { singleFields, repeatedFields, oneOfFields, mapFields } = type;

  const fieldValues = singleFields.map(f => genField(f, ctx));
  const repeatedFieldValues = repeatedFields.map(genRepeatedField);
  const oneOfFieldValues = oneOfFields.map(f => genOneOfField(f, ctx));
  const mapFieldValues = mapFields.map(genMapField);

  return {
    type,
    singleFields: fieldValues,
    repeatedFields: repeatedFieldValues,
    oneOfFields: oneOfFieldValues,
    mapFields: mapFieldValues,
  };
}

function genDefaultPrimitive(type: PrimitiveType): PrimitiveValue {
  return {
    type,
    value: type.defaultValue,
  };
}

function genDefaultEnum(type: EnumType): EnumValue {
  return {
    type,
    selected: type.options[0], // this is guaranteed to exist by protoc
  };
}

function genField(field: Field<TypeName>, ctx: ProtoCtx): Field<ProtobufValue> {
  const [fieldName, typeName] = field;
  return [fieldName, genDefault(typeNameToType(typeName, ctx), ctx)];
}

function genRepeatedField(field: Field<TypeName>): Field<ReadonlyArray<ProtobufValue>> {
  const [fieldName] = field;
  return [fieldName, []];
}

function genOneOfField(field: Field<Fields<TypeName>>, ctx: ProtoCtx): Field<[string, ProtobufValue]> {
  const [fieldName, innerFields] = field;
  const [firstFieldName, firstTypeName] = innerFields[0]; // guaranteed by protoc
  return [fieldName, [firstFieldName, genDefault(typeNameToType(firstTypeName, ctx), ctx)]];
}

function genMapField(field: Field<[TypeName, TypeName]>): Field<Entries<ProtobufValue>> {
  const [fieldName] = field;
  return [fieldName, []];
}
