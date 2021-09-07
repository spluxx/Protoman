import React from 'react';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../models/AppState';
import { AnyAction } from 'redux';
import { ProtoCtx } from '../../../../core/protobuf/protobuf';
import { buildContext } from '../../../../core/protobuf/protoParser';
import { message } from 'antd';
import BuildFailureWarning from './BuildFailureWarning';
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('electron').remote.require('fs');

type SetProtofiles = {
  type: 'SET_PROTOFILES';
  collectionName: string;
  filepaths: string[];
  rootPath?: string;
};

const SET_PROTOFILES = 'SET_PROTOFILES';

type BuildProtofiles = {
  type: 'BUILD_PROTOFILES';
  collectionName: string;
  filepaths: string[];
  rootPath?: string;
};

const BUILD_PROTOFILES = 'BUILD_PROTOFILES';

type BuildProtofilesSuccess = {
  type: 'BUILD_PROTOFILES_SUCCESS';
  collectionName: string;
  ctx: ProtoCtx;
};

const BUILD_PROTOFILES_SUCCESS = 'BUILD_PROTOFILES_SUCCESS';

type BuildProtofilesFailure = {
  type: 'BUILD_PROTOFILES_FAILURE';
  collectionName: string;
  err: Error;
};

const BUILD_PROTOFILES_FAILURE = 'BUILD_PROTOFILES_FAILURE';

type ResetProtofileStatus = {
  type: 'RESET_PROTOFILE_STATUS';
  collectionName: string;
};

const RESET_PROTOFILE_STATUS = 'RESET_PROTOFILE_STATUS';

export const ProtofileManagerActionTypes = [
  SET_PROTOFILES,
  BUILD_PROTOFILES,
  BUILD_PROTOFILES_SUCCESS,
  BUILD_PROTOFILES_FAILURE,
  RESET_PROTOFILE_STATUS,
];
export type ProtofileManagerActions =
  | SetProtofiles
  | BuildProtofiles
  | BuildProtofilesSuccess
  | BuildProtofilesFailure
  | ResetProtofileStatus;

async function isReadable(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.R_OK, (err?: Error) => {
      if (err) reject(`${path} is not readable, or does not exist.`);
      else resolve();
    });
  });
}

export function buildProtofiles(
  collectionName: string,
  filepaths: string[],
  rootPath?: string,
  onFix?: () => void,
): ThunkAction<Promise<void>, AppState, unknown, AnyAction> {
  return async (dispatch): Promise<void> => {
    if (filepaths) {
      dispatch({ type: BUILD_PROTOFILES, collectionName, filepaths });
      try {
        await Promise.all(filepaths.map(isReadable));
        const ctx = await buildContext(filepaths, rootPath);
        dispatch({ type: BUILD_PROTOFILES_SUCCESS, collectionName, ctx });
        dispatch({ type: SET_PROTOFILES, collectionName, filepaths, rootPath });
      } catch (err) {
        dispatch({ type: BUILD_PROTOFILES_FAILURE, collectionName, err });
        if (onFix) {
          message.warn(
            <BuildFailureWarning
              collectionName={collectionName}
              onFix={(): void => {
                message.destroy();
                onFix();
              }}
            />,
            5,
          );
        }
      }
    }
  };
}

export function resetProtofileStatus(collectionName: string): ResetProtofileStatus {
  return {
    type: RESET_PROTOFILE_STATUS,
    collectionName,
  };
}
