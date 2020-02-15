/*
  Environment variables - PostMan's double curly substitution feature
*/

export interface Env {
  readonly vars: ReadonlyArray<[string, string]>;
}
