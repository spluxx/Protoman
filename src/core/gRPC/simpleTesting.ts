import protobuf from 'protobufjs';

function readProto(filePath: string) {
  protobuf.load(filePath).then(result => {
    if (result.nested) {
      const temp = Object.values(result.nested)[0];
      console.log(temp);
    }
  });
}
const filePath = './test1.proto';
readProto(filePath);
