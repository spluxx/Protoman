import protobuf from 'protobufjs';

function readProto(filePath: string) {
  protobuf.load(filePath).then(console.log);
}
const filePath = './test1.proto';
readProto(filePath);
