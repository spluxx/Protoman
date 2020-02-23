import protobuf from 'protobufjs';
import { ProtobufType, MessageType, EnumType, ProtoCtx } from '../../http/body/protobuf';
import { allPrimitiveTypes } from './primitiveTypes';

type FieldPair<T> = [string, T];
type Fields<T> = Array<FieldPair<T>>;

// core function
export function createMessageType(messageType: protobuf.Type): MessageType {
  const repeatedFields: Fields<string> = [];
  const oneOfFields: Fields<Fields<string>> = [];
  const singleFields: Fields<string> = [];
  const mapFields: Fields<[string, string]> = [];

  messageType.fieldsArray.forEach((field: protobuf.FieldBase) => {
    //repeated
    if (field.repeated) {
      repeatedFields.push([field.name, field.type]);
    } else if (field.map) {
      const map = field as protobuf.MapField;
      mapFields.push([map.name, [map.keyType, map.type]]);
    } else {
      const resolvedField = field.resolve();
      singleFields.push([resolvedField.name, resolvedField.resolvedType?.fullName || resolvedField.type]);
    }
  });

  if (messageType.oneofs) {
    messageType.oneofsArray.forEach(one => {
      const options: [string, string][] = one.fieldsArray.map(elt => [elt.name, elt.type]);
      oneOfFields.push([one.name, options]);
    });
  }

  const oneOfFieldNames = oneOfFields.map(([name]) => name);
  const realSingleFields = singleFields.filter(([name]) => !oneOfFieldNames.includes(name));

  const temp: MessageType = {
    tag: 'message',
    name: messageType.fullName, // ex) ProtoModel.Coordinates
    singleFields: realSingleFields.length > 0 ? realSingleFields : singleFields,
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

export async function readProtos(paths: ReadonlyArray<string>): Promise<[ProtobufType[], { [key: string]: string }]> {
  const typeLists = await Promise.all(paths.map(readProto));
  const [types, origin] = typeLists.reduce(
    (acc, typesFromFile, idx) => {
      const [types, origin] = acc;
      return [
        [...types, ...typesFromFile],
        typesFromFile.reduce((o, t) => {
          o[t.name] = paths[idx];
          return o;
        }, origin),
      ];
    },
    [[] as ProtobufType[], {} as { [key: string]: string }],
  );

  return [types.concat(allPrimitiveTypes), origin];
}

export async function buildContext(filepaths: ReadonlyArray<string>): Promise<ProtoCtx> {
  const [protoTypes, origin] = await readProtos(filepaths);
  return {
    types: protoTypes.reduce((acc, type) => {
      acc[type.name] = type;
      return acc;
    }, {} as { [key: string]: ProtobufType }),
    origin,
  };
}
