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

async function readProto(root: protobuf.Root, paths: string[]): Promise<[ProtobufType[], protobuf.Root]> {
  try {
    const newRoot = await root.load(paths);
    return [traverseTypes(newRoot), newRoot];
  } catch (e) {
    throw new Error('Protobuf cannot be read: ' + e);
  }
}

export async function buildContext(filepaths: string[], rootPath?: string): Promise<ProtoCtx> {
  const baseRoot = new protobuf.Root();
  baseRoot.resolvePath = (origin, target): string => path.resolve(rootPath ?? origin, target);

  const [types, root] = await readProto(baseRoot, filepaths);

  const descriptorJson = JSON.stringify(root.toJSON());

  return {
    types: types.concat(allPrimitiveTypes).reduce<ProtoCtx['types']>((acc, t) => {
      acc[t.name] = t;
      return acc;
    }, {}),
    descriptorJson,
  };
}
