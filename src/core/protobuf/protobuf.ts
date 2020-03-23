/* eslint-disable @typescript-eslint/no-use-before-define */

import { Message } from 'protobufjs';

export type ProtobufType = ServiceType | MethodType | PrimitiveType | MessageType | EnumType;
export type ProtobufValue = ServiceValue | MethodValue | PrimitiveValue | MessageValue | EnumValue;
export type FieldName = string;
export type TypeName = string;
export type MethodTypeName = string; //ex) rpc
export type IsStream = boolean;
export type Field<T> = [FieldName, T]; // ex) [userName, string]
export type Fields<T> = ReadonlyArray<Field<T>>;
export type Entry<T> = [string, T];
export type Entries<T> = ReadonlyArray<Entry<T>>;

export interface ProtoCtx {
  readonly types: { [key: string]: ProtobufType };
  readonly origin: { [key: string]: string }; // file path
}

export function typeNameToType(name: TypeName, ctx: ProtoCtx): ProtobufType {
  return ctx.types[name];
}

export interface ServiceType {
  readonly tag: 'service';
  readonly name: TypeName; // ex) ProtoModel.Coordinates
  readonly methods: Fields<TypeName>;
}

//everything should be a tree
export interface MethodType {
  readonly tag: 'method';
  readonly name: TypeName;
  readonly type: MethodTypeName; //ex) rpc
  readonly requestMessage: Field<TypeName>; //ex) [HelloRequestMessage, 'method' ]
  readonly requestStream: IsStream;
  readonly responseMessage: Field<TypeName>;
  readonly responseStream: IsStream;
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

export interface ServiceValue {
  readonly type: ServiceType;
  readonly methods: Fields<MethodValue>;
}

export interface MethodValue {
  readonly type: MethodType;
  readonly requestMessages: ReadonlyArray<MessageValue>;
  readonly responseMessages: ReadonlyArray<MessageValue>;
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
    case 'service':
      return genDefaultService(type as ServiceType, ctx);
    case 'method':
      return genDefaultMethod(type as MethodType, ctx);
    case 'message':
      return genDefaultMessage(type as MessageType, ctx);
    case 'primitive':
      return genDefaultPrimitive(type as PrimitiveType);
    case 'enum':
      return genDefaultEnum(type as EnumType);
  }
}

function genDefaultService(type: ServiceType, ctx: ProtoCtx): ServiceValue {
  //casting(not sure if this is okay though)
  const methodValues: Fields<MethodValue> = type.methods
    .map(f => genField(f, ctx))
    .map(f => {
      return [f[0], f[1] as MethodValue];
    });
  return {
    type: type,
    methods: methodValues,
  };
}

function genDefaultMethod(methodType: MethodType, ctx: ProtoCtx): MethodValue {
  const { requestMessage, responseMessage } = methodType;
  const requestMessagesTemp: MessageValue[] = [];
  const responseMessagesTemp: MessageValue[] = [];
  requestMessagesTemp.push(genDefaultMessage(typeNameToType(requestMessage[0], ctx) as MessageType, ctx));
  responseMessagesTemp.push(genDefaultMessage(typeNameToType(responseMessage[0], ctx) as MessageType, ctx));
  return {
    type: methodType,
    requestMessages: requestMessagesTemp,
    responseMessages: responseMessagesTemp,
  };
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
