import { matchEnvs, applyEnvs } from './env';

test('matchEnvs should successfully identify an interval with double curlies', () => {
  const testStr = '{{host}}/api/users';
  const testHost = 'localhost:3000';
  const testEnv = { host: testHost };
  const expected = [{ interval: [0, 8], envValue: testHost }];
  expect(matchEnvs(testStr, testEnv)).toStrictEqual(expected);
});

test('matchEnvs should successfully identify multiple intervals with double curlies', () => {
  const testStr = '{{host}}/api/users/{{userID}}';
  const testHost = 'localhost:3000';
  const testUserID = '12';
  const testEnv = { host: testHost, userID: testUserID };
  const expected = [
    { interval: [0, 8], envValue: testHost },
    { interval: [19, 29], envValue: testUserID },
  ];
  expect(matchEnvs(testStr, testEnv)).toStrictEqual(expected);
});

test('matchEnvs should return unmatched double curlies with null value', () => {
  const testStr = '{{host}}/api/users';
  const testEnv = {};
  const expected = [{ interval: [0, 8], envValue: null }];
  expect(matchEnvs(testStr, testEnv)).toStrictEqual(expected);
});

test('matchEnvs should just match largest interval when there are nested double curlies', () => {
  const testStr = '{{host-{{secret}}-qwer}}/api/users';
  const testEnv = { 'host-{{secret}}-qwer': 'match me', secret: "don't" };
  const expected = [{ interval: [0, 24], envValue: 'match me' }];
  expect(matchEnvs(testStr, testEnv)).toStrictEqual(expected);
});

test('matchEnvs should success even if there are dangling double curlies', () => {
  const testStr = '{{host}/api/users';
  const testHost = 'localhost:3000';
  const testEnv = { host: testHost };
  expect(matchEnvs(testStr, testEnv)).toStrictEqual([]);
});

test('applyEnvs should successfuly replace an double curly using env vars', () => {
  const testStr = '{{host}}/api/users';
  const testHost = 'localhost:3000';
  const testEnv = { host: testHost };
  const expected = `${testHost}/api/users`;
  expect(applyEnvs(testStr, testEnv)).toStrictEqual(expected);
});

test('applyEnvs should successfuly replace multiple double curlies using env vars', () => {
  const testStr = '{{host}}/api/users/{{userID}}';
  const testHost = 'localhost:3000';
  const testUserID = '12';
  const testEnv = { host: testHost, userID: testUserID };
  const expected = `${testHost}/api/users/${testUserID}`;
  expect(applyEnvs(testStr, testEnv)).toStrictEqual(expected);
});

test('applyEnvs should do nothing if the env is empty', () => {
  const testStr = '{{host}}/api/users/{{userID}}';
  const testEnv = {};
  expect(applyEnvs(testStr, testEnv)).toStrictEqual(testStr);
});

test("applyEnvs should do nothing if there's no double curlies", () => {
  const testStr = 'strstr';
  const testEnv = { str: 'nono' };
  expect(applyEnvs(testStr, testEnv)).toStrictEqual(testStr);
});
