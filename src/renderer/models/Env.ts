/*
  Environment variables - PostMan's double curly substitution feature
*/

export interface Env {
  readonly vars: ReadonlyArray<[string, string]>;
}

const MAX_NAME_LENGTH = 16;

export function validateNewEnvName(name: string, nameList: string[]): boolean {
  return MAX_NAME_LENGTH > name.length && name.length > 0 && !nameList.includes(name);
}

export function validateEnvName(newName: string, currentName: string, nameList: string[]): boolean {
  return currentName === newName || validateNewEnvName(newName, nameList);
}
