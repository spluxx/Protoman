/*
  Environment variables - PostMan's double curly substitution feature
*/

export interface Env {
  readonly vars: Readonly<{ [key: string]: string }>;
}
