import { ServiceType, MethodType } from './grpcContext';
import { ChannelCredentials } from '@grpc/grpc-js';

export type channelID = number | undefined;

export interface ChannelInitiator {
  //kind of duplicated data
  readonly serviceType: ServiceType;
  readonly methodType: MethodType;
  readonly url: string;
  readonly credentials: ChannelCredentials;
  readonly options: object;
}

export interface ChannelDescriptor {
  readonly channelInitiator: ChannelInitiator;
  readonly id: channelID;
  //readonly credentials: object;
}
