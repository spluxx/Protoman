/* eslint-disable @typescript-eslint/no-use-before-define */

export async function serializeJSON(body: string): Promise<Buffer> {
  return Buffer.from(body);
}
