import * as assert from 'assert';
import { readProtos } from '../engine/protoParser';
import { allPrimitiveTypes } from '../engine/primitiveTypes';
import { MessageType } from '../../http/body/protobuf';

const testFilePaths1: string[] = ['./test1.proto'];
const testFilePaths2: string[] = ['./test2.proto'];
const testFilePathsAll: string[] = ['./test1.proto', './test2.proto'];

export async function testProtoParser(): Promise<void> {
  console.log('test starting');
  console.log('testing test1.proto');
  const testResult1 = await readProtos(testFilePaths1);
  assert.strictEqual(testResult1.length, 17);

  const primitiveTypes1 = testResult1.filter(haha => haha.tag === 'primitive');
  assert.strictEqual(primitiveTypes1.length, allPrimitiveTypes.length);

  const messageTypes1 = testResult1.filter(haha => haha.tag === 'message');
  assert.strictEqual(messageTypes1.length, 2);
  messageTypes1.forEach(messageType => {
    const temp = messageType as MessageType;
    if (temp.name === 'test1.User') {
      console.log('checking User model');
      assert.strictEqual(temp.singleFields.length, 10);
      assert.strictEqual(temp.mapFields.length, 1);
      assert.strictEqual(temp.oneOfFields.length, 1);
    }
    if (temp.name === 'test1.Fuck') {
      console.log('checking Fuck model');
      assert.strictEqual(temp.singleFields.length, 2);
    }
  });

  console.log('testing test2.proto');
  const testResult2 = await readProtos(testFilePaths2);
  const hello = testResult2[1] as MessageType;
  console.log(hello.oneOfFields[0]);
  //console.log(testResult2[1]);
  assert.strictEqual(testResult2.length, 17);

  const primitiveTypes2 = testResult2.filter(haha => haha.tag === 'primitive');
  assert.strictEqual(primitiveTypes2.length, allPrimitiveTypes.length);

  const messageTypes2 = testResult2.filter(haha => haha.tag === 'message');
  assert.strictEqual(messageTypes2.length, 1);
  messageTypes2.forEach(messageType => {
    const temp = messageType as MessageType;
    assert.strictEqual(temp.oneOfFields.length, 1);
  });

  const enumTypes2 = testResult2.filter(haha => haha.tag === 'enum');
  assert.strictEqual(enumTypes2.length, 1);

  console.log('testing allFilePaths');
  const testResultAll = await readProtos(testFilePathsAll);
  assert.strictEqual(testResultAll.length, 19);
  const primitiveTypesAll = testResultAll.filter(haha => haha.tag === 'primitive');
  assert.strictEqual(primitiveTypesAll.length, allPrimitiveTypes.length);

  const messageTypesAll = testResultAll.filter(haha => haha.tag === 'message');
  assert.strictEqual(messageTypesAll.length, 3);

  const enumTypesAll = testResultAll.filter(haha => haha.tag === 'enum');
  assert.strictEqual(enumTypesAll.length, 1);
  console.log('test has ended');
}
