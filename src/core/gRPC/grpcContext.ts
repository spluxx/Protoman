import { ProtobufType, TypeName } from '../protobuf/protobuf';
import { GrpcObject } from '@grpc/grpc-js';

export type GrpcType = ServiceType | MethodType | ProtobufType;

export interface ServiceType {
  readonly tag: 'Service';
  readonly name: TypeName; //ex) Greeter
  readonly methods: ReadonlyArray<GrpcType>; //there is only one available service in proto which is rpc
}

export interface MethodType {
  readonly tag: 'Method';
  readonly name: TypeName; //ex)Sayhello
  readonly path: string;
  readonly requestStream: boolean;
  readonly responseStream: boolean;
  readonly requestType: ProtobufType;
  readonly responseType: ProtobufType;
}

export interface GrpcCtx {
  readonly origin: { [key: string]: string };
  readonly types: { [key: string]: GrpcType };
}
