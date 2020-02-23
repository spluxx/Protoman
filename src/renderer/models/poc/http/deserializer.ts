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

// TODO(Louis Lee); finish this
function handleEnum(messageType: EnumType, messageJson: { [k: string]: any }, ctx: ProtoCtx): EnumValue {
  //should return one value
  const temp = {
    type: messageType,
    selected: messageJson[messageType.name],
  };
  return temp;
}

function handlePrimitive(messageType: PrimitiveType, messageJson: any, ctx: ProtoCtx): PrimitiveValue {
  const temp = {
    type: messageType,
    value: messageJson,
  };
  return temp;
}

function handleMessage(messageType: MessageType, messageJson: { [k: string]: any }, ctx: ProtoCtx): any {
  const temp: { [key: string]: any } = {};
  temp['type'] = messageType;
  temp['singleFields'] = messageType.singleFields.map(([fieldName, typeName]) => {
    return [fieldName, createMessageValue(typeNameToType(typeName, ctx), messageJson[fieldName], ctx)];
  });
  temp['repeatedFields'] = messageType.repeatedFields.map(([fieldName, typeName]: [string, string]) => {
    const haha: { [key: string]: ProtobufValue[] } = {};
    haha[fieldName] = messageJson[fieldName].map((value: string | number) =>
      createMessageValue(typeNameToType(typeName, ctx), value, ctx),
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

export function createMessageValue(messageProto: ProtobufType, messageJson: any, ctx: ProtoCtx): ProtobufValue {
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
