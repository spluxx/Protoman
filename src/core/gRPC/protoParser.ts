/* eslint-disable @typescript-eslint/no-use-before-define */
import protoLoader from '@grpc/proto-loader';
import grpcLibrary from '@grpc/grpc-js';
import 'test1.proto';

async function parseProto(protoFileName: string, options: object) {
  protoLoader.load(protoFileName, options).then(packageDefinition => {
    const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
  });
}
