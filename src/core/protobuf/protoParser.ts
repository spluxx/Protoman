import protobuf from 'protobufjs';
import { ProtobufType, MessageType, EnumType, ProtoCtx } from './protobuf';
import { allPrimitiveTypes } from './primitiveTypes';

type FieldPair<T> = [string, T];
type Fields<T> = Array<FieldPair<T>>;

function resolveTypeName(resolvedField: protobuf.FieldBase): string {
  return resolvedField.resolvedType?.fullName || resolvedField.type;
}

export function createMessageType(messageType: protobuf.Type): MessageType {
  const repeatedFields: Fields<string> = [];
  const oneOfFields: Fields<Fields<string>> = [];
  const singleFields: Fields<string> = [];
  const mapFields: Fields<[string, string]> = [];

  messageType.fieldsArray.forEach((field: protobuf.FieldBase) => {
    const resolvedField = field.resolve();
    if (resolvedField.repeated) {
      repeatedFields.push([resolvedField.name, resolveTypeName(resolvedField)]);
    } else if (resolvedField.map) {
      const map = field as protobuf.MapField;
      mapFields.push([map.name, [map.keyType, resolveTypeName(map)]]);
    } else {
      singleFields.push([resolvedField.name, resolveTypeName(resolvedField)]);
    }
  });

  if (messageType.oneofs) {
    messageType.oneofsArray.forEach(one => {
      const options: [string, string][] = one.fieldsArray.map(elt => {
        const typeName = resolveTypeName(elt.resolve());
        return [elt.name, typeName];
      });
      oneOfFields.push([one.name, options]);
    });
  }

  const oneOfFieldNames = oneOfFields.reduce(
    (acc, [, options]) => acc.concat(options.map(([name]) => name)),
    [] as string[],
  );

  const realSingleFields = singleFields.filter(([name]) => !oneOfFieldNames.includes(name));

  const temp: MessageType = {
    tag: 'message',
    name: messageType.fullName,
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
  switch (current.constructor) {
    case protobuf.Type:
      return current.nestedArray.reduce((acc: ProtobufType[], nested: any) => [...acc, ...traverseTypes(nested)], [
        createMessageType(current),
      ]);
    case protobuf.Enum:
      return [createEnumType(current)];
    default:
      return current.nestedArray.reduce((acc: ProtobufType[], nested: any) => [...acc, ...traverseTypes(nested)], []);
  }
}

function readProto(path: string): Promise<ProtobufType[]> {
  return protobuf
    .load(path)
    .then(traverseTypes)
    .catch(err => {
      throw new Error('Protobuf cannot be read');
    });
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
