/* eslint-disable @typescript-eslint/no-empty-interface */
export type ProtoJson = JsonObject | JsonArray | string | number | boolean; // we exclude null since protobuf has no null...
export interface JsonObject extends Record<string, ProtoJson> {}
export interface JsonArray extends Array<ProtoJson> {}
