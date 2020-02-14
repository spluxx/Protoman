// M - Not part of the vm tree

type ProtobufType = PrimitiveType | MessageType | EnumType;
type ProtobufValue = PrimitiveValue | MessageValue | EnumValue;

// function typeNameToType(name: string): ProtobufType | null {}

export interface MessageType {
  readonly tag: 'message';
  readonly name: string; // ex) ProtoModel.Coordinates
  readonly fields: Readonly<{ [key: string]: [string, boolean] }>;
  readonly oneOfFields: Readonly<{ [key: string]: string[] }>;
  readonly mapFields: Readonly<{ [key: string]: [string, string] }>;
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
  readonly name: string; // ex) ProtoModel.Coordinates
  readonly fields: Readonly<{ [key: string]: [string, boolean] }>;
  readonly oneOfFields: Readonly<{ [key: string]: string[] }>;
  readonly mapFields: Readonly<{ [key: string]: [string, string] }>;
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
