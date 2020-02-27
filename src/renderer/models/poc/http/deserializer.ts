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

function getKeyByValue(object: any, value: string): string | undefined {
  return Object.keys(object).find(key => object[key] === value);
}

// TODO(Louis Lee); finish this
function handleEnum(messageType: EnumType, messageJson: any): EnumValue {
  return {
    type: messageType,
    selected: getKeyByValue(messageType.optionValues, messageJson) || messageType.options[0],
  };
}

function handlePrimitive(messageType: PrimitiveType, messageJson: any): PrimitiveValue {
  return {
    type: messageType,
    value: messageJson,
  };
}

function handleMessage(messageType: MessageType, messageJson: { [k: string]: any }, ctx: ProtoCtx): any {
  const temp: { [key: string]: any } = {};
  temp['type'] = messageType;
  temp['singleFields'] = messageType.singleFields.map(([fieldName, typeName]) => {
    return [fieldName, createMessageValue(typeNameToType(typeName, ctx), messageJson[fieldName], ctx)];
  });
  temp['repeatedFields'] = messageType.repeatedFields.map(([fieldName, typeName]: [string, string]) => {
    return [
      fieldName,
      messageJson[fieldName].map((value: string | number) =>
        createMessageValue(typeNameToType(typeName, ctx), value, ctx),
      ),
    ];
  });

  temp['oneOfFields'] = messageType.oneOfFields
    .map(([largeFieldName, options]) => {
      const selectedOption = options.find(([name, type]) => {
        return messageJson[name] !== undefined;
      });
      if (!selectedOption) {
        //TODO(Louis): catch error
        //throw new Error("response does not include" + name )
        return undefined;
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

  temp['mapFields'] = messageType.mapFields.map(([fieldName, [keyType, valueTypeName]]) => {
    const keyValuePairs: {} = messageJson[fieldName];
    const entries = Object.entries(keyValuePairs);
    const temp = entries.map(([key, value]) => {
      const fake = value as { [k: string]: any };
      const valueType: ProtobufType = typeNameToType(valueTypeName, ctx);
      return [key, createMessageValue(valueType, fake, ctx)];
    });
    return [fieldName, temp];
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
      return handlePrimitive(primitiveType, messageJson);
    }
    //enum
    default: {
      const enumType = messageProto as EnumType;
      return handleEnum(enumType, messageJson);
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
