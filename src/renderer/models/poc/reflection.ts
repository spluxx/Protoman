import protobuf, { Root, wrappers, Type, Field } from 'protobufjs';

function traverseTypes(current: any) {
  if (current instanceof protobuf.Type) {
    console.log(current.toString());
  }
  if (current.nestedArray)
    current.nestedArray.forEach((nested: any) => {
      traverseTypes(nested);
    });
}

function readProto(path: string): Promise<Wrapper> {
  return new Promise((resolve, reject) => {
    protobuf.load(path);
    protobuf.load(path, (err, root) => {
      if (err) reject(err);
      // const wrapper = {
      //   path: path,
      //   messages: traverseTypes(root),
      // };
      // resolve(wrapper);
    });
  });
}

// function createProtobufTypes(message: string, root: Root | undefined) {
//   const temp = root?.lookupTypeOrEnum(message);
//   const protoFields = temp?.fieldsArray.forEach((field: Field) => {});
//   //bunch of ifs
//   let hello: ProtobufType = {
//     tag: message,
//     name: temp?.toString(),
//   };
// }

// //for POC just print the messages
// function extractMessages(data: Wrapper[]) {
//   data.forEach((proto: Wrapper) => {
//     protobuf.load(proto.path, (err, root) => {
//       // handle error
//       proto.messages.forEach((message: string) => {
//         createProtobufTypes(message, root);
//       });
//     });
//   });
// }

function readProtos(paths: string[]) {
  // turn all this into promises
  const temp = Promise.all(paths.map(path => readProto(path)));
  // parse.then((data: Wrapper[]) => {
  //   extractMessages(data);
  // });

  //then let's assume we have [ Wrapper(path, [messages]) ]
  //then filter those with the same message names(this is very possible)
  //then based on those messagses use recursion to create messages
  // then save this on the state tree
}
const test = ['./model.proto'];
readProtos(test);
