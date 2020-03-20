import { ChannelDescriptor } from './channel';

export interface GrpcRequestDescriptor {
  readonly channel: ChannelDescriptor;
  readonly headers: ReadonlyArray<[string, string]>;
  readonly body: Uint8Array | undefined;
  readonly expectedProtobufMsg: string | undefined;
}
