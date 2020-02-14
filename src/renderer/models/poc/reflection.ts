import protobuf, { Root } from 'protobufjs';

interface Wrapper {
  path: string;
  messages: string[];
}

function traverseTypes(current: any): string[] {
  let messages: string[] = [];
  if (current instanceof protobuf.Type) {
    console.log(current.toString());
    messages.push(current.toString());
  }
  if (current.nestedArray)
    current.nestedArray.forEach((nested: any) => {
      traverseTypes(nested);
    });

  return messages;
}

function readProto(path: string): Promise<Wrapper> {
  return new Promise((resolve, reject) => {
    protobuf.load(path, (err, root) => {
      if (err) reject(err);
      const wrapper = {
        path: path,
        messages: traverseTypes(root),
      };
      resolve(wrapper);
    });
  });
}

//for POC just print the messages
function extractMessages() {}

function readProtos(paths: string[]) {
  // turn all this into promises
  let parse = Promise.all(paths.map(path => readProto(path)));

  parse.then(data => {
    extractMessages(data);
  });

  //then let's assume we have [ Wrapper(path, [messages]) ]
  //then filter those with the same message names(this is very possible)
  //then based on those messagses use recursion to create messages
  // then save this on the state tree
}
