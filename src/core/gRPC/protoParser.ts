import * as protoLoader from '@grpc/proto-loader';
import * as grpcLibrary from '@grpc/grpc-js';

export async function parseProto(protoFileName: string, options: object) {
  const packageDefinition = protoLoader.loadSync(protoFileName, options);
  const packageObject1 = grpcLibrary.loadPackageDefinition(packageDefinition);

  // console.log(typeof packageObject1);
  // console.log(typeof packageObject1.Greeter);
  // const one = Object.values(packageObject1.Greeter)[0];
  // console.log(typeof one);

  // //console.log(packageObject1);
}

export function buildGrpcContext() {}

interface person {
  name: string;
  age: number;
}
export interface testing {
  new (name: string, age: number): person;
  hello: string;
}

const louis: person = {
  name: 'louis',
  age: 17,
};
function print(name: string, age: number): person {
  return {
    name: name,
    age: age,
  };
}

const test: testing = print, 'hi';
