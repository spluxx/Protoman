import protobuf from 'protobufjs';
import { ProtobufType, MessageType, EnumType, ProtoCtx } from '../../http/body/protobuf';
import { allPrimitiveTypes } from './primitiveTypes';

type FieldPair<T> = [string, T];
type Fields<T> = Array<FieldPair<T>>;

// core function
export function createMessageType(messageType: protobuf.Type): MessageType {
  console.log(messageType);

  const repeatedFields: Fields<string> = [];
  const oneOfFields: Fields<Fields<string>> = [];
  const singleFields: Fields<string> = [];
  let realSingleFields: Fields<string> = [];
  const mapFields: Fields<[string, string]> = [];

  messageType.fieldsArray.forEach((field: protobuf.FieldBase) => {
    //repeated
    if (field.repeated) {
      repeatedFields.push([field.name, field.type]);
    } else if (field.map) {
      const map = field as protobuf.MapField;
      mapFields.push([map.name, [map.keyType, map.type]]);
    } else {
      singleFields.push([field.name, field.type]);
    }
  });

  if (messageType.oneofs) {
    messageType.oneofsArray.forEach(one => {
      //TODO : finish this part
      console.log(one.fieldsArray);
      const options = one.fieldsArray.reduce(
        (acc, elt) => [...acc, [elt.name, elt.type] as [string, string]],
        [] as [string, string][],
      );
      oneOfFields.push([one.name, options]);
      realSingleFields = singleFields.filter(field => !one.oneof.includes(field[0]));
    });
  }

  const temp: MessageType = {
    tag: 'message',
    name: messageType.fullName, // ex) ProtoModel.Coordinates
    singleFields: realSingleFields,
    repeatedFields: repeatedFields,
    oneOfFields: oneOfFields,
    mapFields: mapFields,
  };
  return temp;
}

function createEnumType(enumType: protobuf.Enum): EnumType {
  const temp: EnumType = {
    tag: 'enum',
    name: enumType.fullName,
    options: Object.keys(enumType.values),
    optionValues: enumType.values,
  };
  return temp;
}

function traverseTypes(current: any): ProtobufType[] {
  if (current instanceof protobuf.Type) {
    return [createMessageType(current)];
  } else if (current instanceof protobuf.Enum) {
    return [createEnumType(current)];
  } else if (current.nestedArray) {
    return current.nestedArray.reduce((acc: ProtobufType[], nested: any) => [...acc, ...traverseTypes(nested)], []);
  } else {
    console.error("something's wrong...", current);
    return [];
  }
}

function readProto(path: string): Promise<ProtobufType[]> {
  return protobuf.load(path).then(traverseTypes);
}

function flatten<T>(listOfList: T[][]): T[] {
  return listOfList.reduce((longList, list) => [...longList, ...list], []);
}

export function readProtos(paths: ReadonlyArray<string>): Promise<ProtobufType[]> {
  return Promise.all(paths.map(readProto))
    .then(flatten)
    .then(list => [...list, ...allPrimitiveTypes]);
}

export async function buildContext(filepaths: ReadonlyArray<string>): Promise<ProtoCtx> {
  const protoTypes = await readProtos(filepaths);
  return {
    types: protoTypes.reduce((acc, type) => {
      acc[type.name] = type;
      return acc;
    }, {} as { [key: string]: ProtobufType }),
  };
}
