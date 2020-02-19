type SetProtofiles = {
  type: 'SET_PROTOFILES';
  collectionName: string;
  filepaths: string[];
};

const SET_PROTOFILES = 'SET_PROTOFILES';

export const ProtofileManagerActionTypes = [SET_PROTOFILES];
export type ProtofileManagerActions = SetProtofiles;

export function setProtofiles(collectionName: string, filepaths: string[]): SetProtofiles {
  return {
    type: SET_PROTOFILES,
    collectionName,
    filepaths,
  };
}
