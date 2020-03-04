import { PrimitiveType } from './protobuf';

const double: PrimitiveType = {
  tag: 'primitive',
  name: 'double',
  defaultValue: '0',
};

const float: PrimitiveType = {
  tag: 'primitive',
  name: 'float',
  defaultValue: '0',
};

export const int32: PrimitiveType = {
  tag: 'primitive',
  name: 'int32',
  defaultValue: '0',
};

const int64: PrimitiveType = {
  tag: 'primitive',
  name: 'int64',
  defaultValue: '0',
};

const uint32: PrimitiveType = {
  tag: 'primitive',
  name: 'uint32',
  defaultValue: '0',
};

const uint64: PrimitiveType = {
  tag: 'primitive',
  name: 'uint64',
  defaultValue: '0',
};

const sint32: PrimitiveType = {
  tag: 'primitive',
  name: 'sint32',
  defaultValue: '0',
};

const sint64: PrimitiveType = {
  tag: 'primitive',
  name: 'sint64',
  defaultValue: '0',
};

const fixed32: PrimitiveType = {
  tag: 'primitive',
  name: 'fixed32',
  defaultValue: '0',
};

const fixed64: PrimitiveType = {
  tag: 'primitive',
  name: 'fixed64',
  defaultValue: '0',
};

const sfixed32: PrimitiveType = {
  tag: 'primitive',
  name: 'sfixed32',
  defaultValue: '0',
};
const sfixed64: PrimitiveType = {
  tag: 'primitive',
  name: 'sfixed64',
  defaultValue: '0',
};
export const bool: PrimitiveType = {
  tag: 'primitive',
  name: 'bool',
  defaultValue: 'false',
};
export const string: PrimitiveType = {
  tag: 'primitive',
  name: 'string',
  defaultValue: '',
};

const bytes: PrimitiveType = {
  tag: 'primitive',
  name: 'bytes',
  defaultValue: '',
};

export const allPrimitiveTypes: PrimitiveType[] = [
  double,
  float,
  int32,
  int64,
  uint32,
  uint64,
  sint32,
  sint64,
  fixed32,
  fixed64,
  sfixed32,
  sfixed64,
  bool,
  string,
  bytes,
];
