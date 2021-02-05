import { CacheData } from '../../../core/protobuf/protobuf';

type LoadCacheAction = {
  type: 'LOAD_CACHE';
  value: CacheData;
};

const LOAD_CACHE = 'LOAD_CACHE';
export const CacheActionTypes = [LOAD_CACHE];
export type CacheAction = LoadCacheAction;
export function loadCacheAction(value: CacheData): LoadCacheAction {
  return {
    type: LOAD_CACHE,
    value,
  };
}
