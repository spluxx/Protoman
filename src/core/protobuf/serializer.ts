/* eslint-disable @typescript-eslint/no-use-before-define */
import { MessageValue, ProtobufValue, PrimitiveValue, EnumValue, ProtoCtx } from './protobuf';
import protobuf from 'protobufjs';
import { ProtoJson, JsonObject, JsonArray } from './protoJson';

export async function serializeProtobuf(body: MessageValue, ctx: ProtoCtx): Promise<Buffer> {
  const jsonDescriptor = JSON.parse(ctx.descriptorJson);
  const rec = makeMessageValue(body);

  const root = protobuf.Root.fromJSON(jsonDescriptor);
  const messageType = root.lookupType(body.type.name);

  // TEST print serialize message
  // console.log('MESSAGE: ', messageType.create(rec));

  // TEST deserialize
  // const root2 = protobuf.Root.fromJSON(JSON.parse(ctx.descriptorJson));
  // const messageType2 = root2.lookupType(body.type.name);
  // const decoded = messageType2.decode(Buffer.from(messageType.encode(messageType.create(rec)).finish()));
  // const obj = decoded.toJSON();
  // console.log('DESERIALIZE TEST ', obj);

  return Buffer.from(messageType.encode(messageType.create(rec)).finish());
}

export function createMessageRecurse(protobufValue: ProtobufValue): ProtoJson {
  switch (protobufValue.type.tag) {
    case 'message': {
      const messageValue = protobufValue as MessageValue;
      return makeMessageValue(messageValue);
    }
    case 'primitive': {
      const primitiveValue = protobufValue as PrimitiveValue;
      return makePrimitiveValue(primitiveValue);
    }
    default: {
      const enumValue = protobufValue as EnumValue;
      return makeEnumValue(enumValue);
    }
  }
}

function makeMessageValue(messagevalue: MessageValue): JsonObject {
  const singleFields = messagevalue.singleFields.map(([name, value]): [string, ProtoJson] => [
    name,
    createMessageRecurse(value),
  ]);

  const oneOfFields = messagevalue.oneOfFields.map(([, [name, value]]): [string, ProtoJson] => [
    name,
    createMessageRecurse(value),
  ]);

  const repeatedFields = messagevalue.repeatedFields.map(([name, values]): [string, JsonArray] => [
    name,
    values.map(createMessageRecurse),
  ]);

  const mapFields = messagevalue.mapFields.map(([name, kvPairs]): [string, JsonObject] => [
    name,
    toObject(kvPairs.map(([k, v]): [string, ProtoJson] => [k, createMessageRecurse(v)])),
  ]);

  const allFields = [...singleFields, ...oneOfFields, ...repeatedFields, ...mapFields];

  return toObject(allFields);
}

function makePrimitiveValue(primitiveValue: PrimitiveValue): number | string | boolean | null {
  if (primitiveValue.value === null) {
    return null;
  }

  switch (primitiveValue.type.name) {
    case 'bool':
      return primitiveValue.value === 'true';
    case 'string':
    case 'bytes':
      return primitiveValue.value; // protobuf json representation accepts base64 string, so we can just pass it
    default: {
      return Number(primitiveValue.value);
    }
  }
}

function makeEnumValue(enumValue: EnumValue): number {
  return enumValue.type.optionValues[enumValue.selected];
}

function toObject(entries: [string, ProtoJson][]): JsonObject {
  return entries.reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {} as JsonObject);
}
