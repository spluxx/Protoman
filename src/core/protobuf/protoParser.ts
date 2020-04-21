import protobuf from 'protobufjs';
import { ProtobufType, MessageType, EnumType, ProtoCtx } from './protobuf';
import { allPrimitiveTypes } from './primitiveTypes';
import path from 'path';

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

function traverseTypes(
  current: protobuf.ReflectionObject & { nestedArray?: protobuf.ReflectionObject[] },
): ProtobufType[] {
  const types: ProtobufType[] = [];
  if (current instanceof protobuf.Type) {
    types.push(createMessageType(current));
  } else if (current instanceof protobuf.Enum) {
    types.push(createEnumType(current));
  }

  if (current.nestedArray) {
    types.push(
      ...current.nestedArray.reduce((acc: ProtobufType[], nested: any) => [...acc, ...traverseTypes(nested)], []),
    );
  }

  return types;
}

function readProto(root: protobuf.Root, path: string): Promise<ProtobufType[]> {
  return root
    .load(path)
    .then(traverseTypes)
    .catch(err => {
      throw new Error('Protobuf cannot be read: ' + err);
    });
}

export async function readProtos(
  paths: ReadonlyArray<string>,
  rootPath?: string,
): Promise<[ProtobufType[], { [key: string]: string }]> {
  const root = new protobuf.Root();
  root.resolvePath = (origin, target): string => path.resolve(rootPath ?? origin, target);

  const typeLists = [];
  for (let i = 0; i < paths.length; i++) {
    typeLists.push(await readProto(root, paths[i]));
  }

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

export async function buildContext(filepaths: ReadonlyArray<string>, rootPath?: string): Promise<ProtoCtx> {
  const [protoTypes, origin] = await readProtos(filepaths, rootPath);
  return {
    types: protoTypes.reduce((acc, type) => {
      acc[type.name] = type;
      return acc;
    }, {} as { [key: string]: ProtobufType }),
    origin,
  };
}
