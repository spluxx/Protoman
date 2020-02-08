import { MessageValue } from './body/protobuf';

export interface RequestBuilder {
  readonly url: string;
  readonly headers: { [key: string]: string };
  readonly body: MessageValue | null;
  readonly responseMessageName: string | null;
}
