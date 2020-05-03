import { transformPBJSError } from './pbjsErrors';

test('transformPBJSError should add "Protobuf.js Error: " in front of every pbjs error', () => {
  const e = new Error('');

  const transformed = transformPBJSError(e);

  expect(transformed.message).toEqual('Protobuf.js Error:\n' + e.message);
});

test('transformPBJSError should transform index out of errors to a more understandable text', () => {
  const e = new Error('index out of range: 2 + 97 > 11');

  const transformed = transformPBJSError(e);

  expect(transformed.message).toEqual(
    'Protobuf.js Error:\nIndex out of range: the reader was at position 2 and tried to read 97 more (bytes), but the given buffer was 11 bytes',
  );
});
