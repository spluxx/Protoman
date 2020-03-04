import { Headers } from 'node-fetch';

export function convertHeaders(headers: ReadonlyArray<[string, string]>): Headers {
  return headers.reduce((h, [name, value]) => {
    if (name.length > 0) {
      h.append(name, value);
    }
    return h;
  }, new Headers());
}

export function unconvertHeaders(headers: Headers): ReadonlyArray<[string, string]> {
  const h: [string, string][] = [];
  headers.forEach((value: string, name: string) => h.push([name, value]));
  console.log(headers.get('set-cookie'));
  return h;
}
