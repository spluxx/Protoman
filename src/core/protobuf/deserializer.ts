/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  MessageValue,
  ProtobufValue,
  PrimitiveValue,
  EnumValue,
  MessageType,
  ProtobufType,
  PrimitiveType,
  EnumType,
  typeNameToType,
  ProtoCtx,
} from './protobuf';
import protobuf from 'protobufjs';
import { createMessageType } from './protoParser';
import { ProtoJson, JsonObject, JsonArray } from './protoJson';

export async function deserializeProtobuf(
  arrayBuffer: Uint8Array,
  expectedMsg: string,
  ctx: ProtoCtx,
): Promise<MessageValue> {
  const root = protobuf.Root.fromJSON(JSON.parse(ctx.descriptorJson));
  const messageType = root.lookupType(expectedMsg);
  const decoded = messageType.decode(arrayBuffer);
  return handleMessage(createMessageType(messageType), decoded.toJSON(), ctx);
}

export function createMessageValue(messageProto: ProtobufType, messageJson: ProtoJson, ctx: ProtoCtx): ProtobufValue {
  switch (messageProto.tag) {
    case 'message':
      const messageType = messageProto as MessageType;
      const obj = messageJson ?? {};
      assertType(obj, ['object']);
      return handleMessage(messageType, obj as JsonObject, ctx);
    case 'primitive':
      const primitiveType = messageProto as PrimitiveType;
      const prim = messageJson ?? primitiveType.defaultValue;
      assertType(prim, ['string', 'number', 'boolean']);
      return handlePrimitive(primitiveType, prim as string | number | boolean);
    case 'enum':
      const enumType = messageProto as EnumType;
      const e = messageJson ?? 0;
      assertType(e, ['number']);
      return handleEnum(enumType, e as number);
  }
}

function handleEnum(messageType: EnumType, jsonValue: number): EnumValue {
  const selected = Object.entries(messageType.optionValues).find(([, value]) => value === jsonValue)?.[0];
  if (!selected) {
    throw deserializeError(`The given enum value ${jsonValue} isn't defined in ${messageType.name}`);
  } else {
    return {
      type: messageType,
      selected,
    };
  }
}

function handlePrimitive(messageType: PrimitiveType, messageJson: string | number | boolean): PrimitiveValue {
  return {
    type: messageType,
    value: messageJson.toString(),
  };
}

function handleMessage(messageType: MessageType, messageJson: JsonObject, ctx: ProtoCtx): MessageValue {
  const singleFields = messageType.singleFields.map(([fieldName, typeName]): [string, ProtobufValue] => {
    return [fieldName, createMessageValue(typeNameToType(typeName, ctx), messageJson[fieldName], ctx)];
  });

  const repeatedFields = messageType.repeatedFields.map(([fieldName, typeName]): [string, ProtobufValue[]] => {
    const arr = messageJson[fieldName] ?? [];
    assertType(arr, ['array']);
    return [fieldName, (arr as JsonArray).map(value => createMessageValue(typeNameToType(typeName, ctx), value, ctx))];
  });

  const oneOfFields = messageType.oneOfFields
    .map(([largeFieldName, options]): [string, [string, ProtobufValue]] => {
      const selectedOption = options.find(([name]) => messageJson[name] != null);
      if (!selectedOption) {
        throw deserializeError(`The given json couldn't find any field for the 'oneof' field ${largeFieldName}.`);
      } else {
        const [name, typeName] = selectedOption;
        const smallValue = messageJson[name];
        const hello: [string, ProtobufValue] = [
          name,
          createMessageValue(typeNameToType(typeName, ctx), smallValue, ctx),
        ];
        return [largeFieldName, hello];
      }
    })
    .filter(a => !!a);

  const mapFields = messageType.mapFields.map(([fieldName, [valueTypeName]]): [string, [string, ProtobufValue][]] => {
    const obj = messageJson[fieldName] ?? {};
    assertType(obj, ['object']);
    const entries: [string, ProtoJson][] = Object.entries(obj);
    const temp: [string, ProtobufValue][] = entries.map(([key, value]) => {
      const valueType: ProtobufType = typeNameToType(valueTypeName, ctx);
      return [key, createMessageValue(valueType, value, ctx)];
    });
    return [fieldName, temp];
  });

  return {
    type: messageType,
    singleFields,
    repeatedFields,
    oneOfFields,
    mapFields,
  };
}

function deserializeError(msg: string): Error {
  return new Error('Error while parsing the JSON representation of the protobuf message:\n' + msg);
}

function assertType(json: ProtoJson, expectedTypes: string[]): void {
  const actual = Array.isArray(json) ? 'array' : typeof json;
  if (expectedTypes.includes(actual)) {
    return;
  } else {
    throw deserializeError(`Expected ${expectedTypes}, but got ${actual}`);
  }
}
