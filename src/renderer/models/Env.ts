/*
  Environment variables - PostMan's double curly substitution feature
*/

export type Variables = { [key: string]: string };

export interface Env {
  readonly id: string;
  readonly name: string;
  readonly vars: Readonly<Variables>;
}
