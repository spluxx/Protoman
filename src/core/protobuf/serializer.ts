/* eslint-disable @typescript-eslint/no-use-before-define */
import { MessageValue, ProtobufValue, PrimitiveValue, EnumValue, ProtoCtx } from './protobuf';
import protobuf from 'protobufjs';
import { ProtoJson, JsonObject, JsonArray } from './protoJson';

export async function serializeProtobuf(body: MessageValue, ctx: ProtoCtx): Promise<Buffer> {
  const jsonDescriptor = JSON.parse(ctx.descriptorJson);
  const rec = makeMessageValue(body);

  const root = protobuf.Root.fromJSON(jsonDescriptor);
  const messageType = root.lookupType(body.type.name);

  const buffer = Buffer.from(messageType.encode(messageType.create(rec as JsonObject)).finish());

  return buffer;
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

const filterNullValue = (val: ProtobufValue): boolean => {
  // only primitiveValue
  if (val?.type?.tag === 'primitive') {
    return (val as PrimitiveValue).value !== null;
  }

  return true;
};

function makeMessageValue(messagevalue: MessageValue): JsonObject | null {
  const singleFields = messagevalue.singleFields
    .filter(([_, value]) => filterNullValue(value))
    .map(([name, value]): [string, ProtoJson] => [name, createMessageRecurse(value)]);

  const oneOfFields = messagevalue.oneOfFields
    .filter(([, [_, value]]) => filterNullValue(value))
    .map(([, [name, value]]): [string, ProtoJson] => [name, createMessageRecurse(value)]);

  const repeatedFields = messagevalue.repeatedFields.map(([name, values]): [string, JsonArray] => [
    name,
    values.filter(value => filterNullValue(value)).map(createMessageRecurse),
  ]);

  const mapFields = messagevalue.mapFields.map(([name, kvPairs]): [string, JsonObject] => [
    name,
    toObject(
      kvPairs
        .filter(([k, value]) => filterNullValue(value))
        .map(([k, v]): [string, ProtoJson] => [k, createMessageRecurse(v)]),
    ),
  ]);

  const allFields = [...singleFields, ...oneOfFields, ...repeatedFields, ...mapFields];

  if (!allFields.length) {
    return null;
  }

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
