// M - Not part of the vm tree

type ProtobufType = PrimitiveType | MessageType | OneOfType | EnumType;
type ProtobufValue = PrimitiveValue | MessageValue | OneOfValue | EnumValue;
type OneOrMultiple<T> = T | ReadonlyArray<T>;

export interface MessageType {
  readonly tag: 'message';
  readonly name: string; // ex) ProtoModel.Coordinates
  readonly isRepeated: Readonly<{ [key: string]: boolean }>;
  readonly fields: Readonly<{ [key: string]: ProtobufType }>;
}

export interface OneOfType {
  readonly tag: 'oneof';
  readonly name: string;
  readonly options: Readonly<{ [key: string]: ProtobufType }>;
}

export interface PrimitiveType {
  readonly tag: 'primitive';
  readonly name: string;
  readonly defaultValue: string;
}

export interface EnumType {
  readonly tag: 'enum';
  readonly name: string;
  readonly options: ReadonlyArray<string>;
  readonly optionValues: Readonly<{ [key: string]: number }>;
}

// VM

export interface MessageValue {
  readonly tag: 'message';
  readonly name: string;
  readonly isRepeated: Readonly<{ [key: string]: boolean }>;
  readonly fieldValues: Readonly<{ [key: string]: OneOrMultiple<ProtobufValue> }>;
}

export interface OneOfValue {
  readonly tag: 'oneof';
  readonly name: string;
  readonly options: ReadonlyArray<{ [key: string]: ProtobufValue }>;
  readonly currentValue: ProtobufValue;
}

export interface PrimitiveValue {
  readonly tag: 'primitive';
  readonly name: string;
  readonly currentValue: string;
}

export interface EnumValue {
  readonly tag: 'enum';
  readonly name: string;
  readonly options: ReadonlyArray<string>;
  readonly currentValue: string;
}
