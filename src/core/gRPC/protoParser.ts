import * as protoLoader from '@grpc/proto-loader';
import * as grpcLibrary from '@grpc/grpc-js';

export async function parseProto(protoFileName: string, options: object) {
  const packageDefinition = protoLoader.loadSync(protoFileName, options);
  const packageObject1 = grpcLibrary.loadPackageDefinition(packageDefinition);
  const one = Object.values(packageObject1.Greeter)[0];
  console.log(one.SayHello.requestType);

  //console.log(Object.values(packageObject1.Greeter)[0]);
}

export function buildGrpcContext() {}
