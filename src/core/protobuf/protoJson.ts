/* eslint-disable @typescript-eslint/no-empty-interface */
export type ProtoJson = JsonObject | JsonArray | string | number | boolean | null;
export interface JsonObject extends Record<string, ProtoJson> {}
export interface JsonArray extends Array<ProtoJson> {}
