import protobuf, { Root } from 'protobufjs';

function addToList(type: protobuf.Type) {
  console.log(type.fullName);
  //add to global list of messages
}

function traverseTypes(current: any) {
  if (current instanceof protobuf.Type) addToList(current);
  if (current.nestedArray)
    current.nestedArray.forEach((nested: any) => {
      traverseTypes(nested);
    });
}

function readProto(path: string) {
  protobuf.load(path, (err, root) => {
    if (err) throw err;

    traverseTypes(root);
    //return pair (path, [message]);
  });
}

function extractMessages();

function readProtos(paths: string[]) {
  // turn all this into promises
  paths.forEach(path => {
    readProto(path);
  });

  //then let's assume we have [ Pair(path, [messages]) ]
  //then filter those with the same message names(this is very possible)
  let pairs = [];
  //then based on those messagses use recursion
  messages.forEach(message => {});
}
