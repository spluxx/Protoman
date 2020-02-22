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
} from '../../http/body/protobuf';
import protobuf from 'protobufjs';
import { createMessageType } from '../engine/protoParser';

// function recurse(current: object)
// parent = {};
// if(current == message) parent[current.name] = recurse(current.value);
// else parent[current.name] = current.value;

// todo make a util function to handle undefined
function makeMessageValue(messagevalue: MessageValue): any {
  const current: { [key: string]: any } = {};
  messagevalue.singleFields.forEach(([name, value]) => {
    current[name] = createMessageRecurse(value);
  });

  messagevalue.oneOfFields.forEach(([name, value]) => {
    current[name] = createMessageRecurse(value[1]);
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
      //not now
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
  return new Buffer(messageType.encode(createMessageRecurse(body)).finish());
}

// TODO(Louis Lee); finish this
function handleEnum(messageType: EnumType, messageJson: { [k: string]: any }, ctx: ProtoCtx): EnumValue {
  //should return one value
  const temp = {
    type: messageType,
    selected: messageJson[messageType.name],
  };
  return temp;
}

function handlePrimitive(messageType: PrimitiveType, messageJson: { [k: string]: any }, ctx: ProtoCtx): PrimitiveValue {
  const temp = {
    type: messageType,
    value: messageJson[messageType.name],
  };
  return temp;
}

function handleMessage(messageType: MessageType, messageJson: { [k: string]: any }, ctx: ProtoCtx): any {
  const temp: { [key: string]: any } = {};
  temp['type'] = messageType;
  temp['singleFields'] = messageType.singleFields.map(([fieldName, typeName]) => {
    return [fieldName, createMessageValue(typeNameToType(typeName, ctx), messageJson, ctx)];
  });
  temp['repeatedFields'] = messageType.repeatedFields.map(([fieldName, typeName]: [string, string]) => {
    // return [fieldname, array<protobufvalue> ]
    const haha: { [key: string]: ProtobufValue[] } = {};
    haha[fieldName] = messageJson[fieldName].map((value: string | number) =>
      createMessageValue(typeNameToType(typeName, ctx), messageJson[fieldName][value], ctx),
    );
    return haha;
  });

  messageType.oneOfFields.map(field => field);
  temp['oneOfFields'] = messageType.oneOfFields.map(([largeFieldName, [[smallFieldName, value]]]) => {
    const haha = [];
    const largeValue: { [key: string]: any } = messageJson[largeFieldName];
    const smallValue: { [key: string]: any } = largeValue[smallFieldName];
    const hello: [string, ProtobufValue] = [
      smallFieldName,
      createMessageValue(typeNameToType(value, ctx), smallValue, ctx),
    ];
    haha.push([largeFieldName, hello]);
    return haha;
  });

  temp['mapFields'] = messageType.mapFields.map(([fieldName, [keyType, valueTypeName]]) => {
    const haha = [];
    const keyValuePairs: {} = messageJson[fieldName];
    const entries = Object.entries(keyValuePairs);
    const temp = entries.map(([key, value]) => {
      const fake = value as { [k: string]: any };
      const valueType: ProtobufType = typeNameToType(valueTypeName, ctx);
      return [key, createMessageValue(valueType, fake, ctx)];
    });
    haha.push([fieldName, temp]);
    return [keyType, haha];
  });

  return temp;
}

export function createMessageValue(
  messageProto: ProtobufType,
  messageJson: { [k: string]: any },
  ctx: ProtoCtx,
): ProtobufValue {
  switch (messageProto.tag) {
    case 'message': {
      const messageType = messageProto as MessageType;
      return handleMessage(messageType, messageJson, ctx);
    }
    case 'primitive': {
      const primitiveType = messageProto as PrimitiveType;
      return handlePrimitive(primitiveType, messageJson, ctx);
    }
    //enum
    default: {
      const enumType = messageProto as EnumType;
      return handleEnum(enumType, messageJson, ctx);
    }
  }
}

//TODO(finish this)
export async function deserialize(
  arrayBuffer: Uint8Array,
  responseMessageName: string,
  path: string,
  ctx: ProtoCtx,
): Promise<MessageValue> {
  const root = await protobuf.load(path);
  const messageType = root.lookupType(responseMessageName);
  const decoded = messageType.decode(arrayBuffer);
  const temp = createMessageValue(createMessageType(messageType), decoded.toJSON(), ctx) as MessageValue;
  return temp;
}
