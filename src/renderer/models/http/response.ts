import { MessageValue } from './body/protobuf';

export interface Response {
  readonly status: string; // ex) 400 (Bad Request)
  readonly headers: Readonly<{ [key: string]: string }>;
  readonly body: MessageValue | null;
}
