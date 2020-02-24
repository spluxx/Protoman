/* eslint-disable @typescript-eslint/no-use-before-define */
import { MessageValue, ProtobufValue, PrimitiveValue, EnumValue, EnumType, ProtoCtx } from '../../http/body/protobuf';
import protobuf from 'protobufjs';

function makeMessageValue(messagevalue: MessageValue): any {
  const current: { [key: string]: any } = {};
  messagevalue.singleFields.forEach(([name, value]) => {
    current[name] = createMessageRecurse(value);
  });

  messagevalue.oneOfFields.forEach(([, value]) => {
    const fieldName = value[0];
    current[fieldName] = createMessageRecurse(value[1]);
  });

  messagevalue.repeatedFields.forEach(([name, values]) => {
    current[name] = values.map(createMessageRecurse);
  });

  messagevalue.mapFields.forEach(([name, kvPairs]) => {
    current[name] = {};
    kvPairs.forEach(([k, v]) => {
      current[name][k] = createMessageRecurse(v);
    });
  });
  return current;
}

function makePrimitiveValue(primitiveValue: PrimitiveValue): any {
  switch (primitiveValue.type.name) {
    case 'bool': {
      return primitiveValue.value == 'true';
    }
    case 'string': {
      return primitiveValue.value;
    }
    case 'bytes': {
      //TODO(Louis): not now
    }
    default: {
      return Number(primitiveValue.value);
    }
  }
}

function makeEnumValue(enumValue: EnumValue): any {
  return enumValue.type.optionValues[enumValue.selected];
}

export function createMessageRecurse(protobufValue: ProtobufValue): any {
  switch (protobufValue.type.tag) {
    case 'message': {
      const messageValue = protobufValue as MessageValue;
      return makeMessageValue(messageValue);
    }
    case 'primitive': {
      const primitiveValue = protobufValue as PrimitiveValue;
      return makePrimitiveValue(primitiveValue);
    }
    //enum
    default: {
      const enumValue = protobufValue as EnumValue;
      return makeEnumValue(enumValue);
    }
  }
}

export async function serialize(body: MessageValue, path: string): Promise<Buffer> {
  const root = await protobuf.load(path);
  const messageType = root.lookupType(body.type.name);
  const rec = createMessageRecurse(body);
  const buf = new Buffer(messageType.encode(messageType.create(rec)).finish());
  return buf;
}
