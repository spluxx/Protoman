import { ProtobufValue, ProtoCtx } from '../../core/protobuf/protobuf';
import { Flow } from './flow';

export interface Collection {
  readonly protoFilepaths: ReadonlyArray<string>;
  readonly protoRootPath?: string;
  readonly buildStatus: 'default' | 'building' | 'success' | 'failure';
  readonly buildError: Error | undefined;
  readonly protoCtx: ProtoCtx;
  readonly messageNames: ReadonlyArray<string>;
  readonly flows: ReadonlyArray<[string, Flow]>;
}

const MAX_NAME_LENGTH = 36;

export function validateNewCollectionName(name: string, nameList: string[]): boolean {
  return MAX_NAME_LENGTH > name.length && name.length > 0 && !nameList.includes(name);
}

export function validateCollectionName(newName: string, currentName: string, nameList: string[]): boolean {
  return currentName === newName || validateNewCollectionName(newName, nameList);
}
