/* eslint-disable @typescript-eslint/no-use-before-define */
import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { MessageValueViewActionTypes, MessageValueViewAction } from './MessageValueViewActions';
import { AppState } from '../../../models/AppState';
import { getByKey, getEntryByKey } from '../../../utils/utils';
import {
  MessageValue,
  ProtobufValue,
  PrimitiveValue,
  EnumValue,
  ProtoCtx,
  typeToDefaultValue,
  PrimitiveType,
} from '../../../../core/protobuf/protobuf';

function extractBody(d: Draft<AppState>): Draft<MessageValue> | undefined {
  const flow = getByKey(getByKey(d.collections, d.currentCollection)?.flows, d.currentFlow);
  return flow?.requestBuilder?.bodies?.protobuf;
}

export default function MessageValueViewReducer(s: AppState, action: AnyAction): AppState {
  if (MessageValueViewActionTypes.includes(action.type)) {
    const a = action as MessageValueViewAction;

    switch (a.type) {
      case 'VALUE_CHANGE':
        return produce(s, draft => {
          const body = extractBody(draft);
          body && changeValue(body, a.path.split('/'), a.value);
        });
      case 'FIELD_CHANGE':
        return produce(s, draft => {
          const body = extractBody(draft);
          body && changeField(body, a.path.split('/'), a.value, a.ctx);
        });
      case 'ENTRY_ADD':
        return produce(s, draft => {
          const body = extractBody(draft);
          body && addEntry(body, a.path.split('/'), a.ctx);
        });
      case 'ENTRY_REMOVE':
        return produce(s, draft => {
          const body = extractBody(draft);
          body && removeEntry(body, a.path.split('/'));
        });
      case 'ALL_CHANGED':
        return produce(s, draft => {
          const flow = getByKey(getByKey(draft.collections, draft.currentCollection)?.flows, draft.currentFlow);
          if (flow && flow.requestBuilder && flow.requestBuilder.bodies) {
            flow.requestBuilder.bodies.protobuf = a.value as Draft<MessageValue>;
          }
        });
      default:
        return s;
    }
  }

  return s;
}

// Change Value Helpers

function changeValue(v: Draft<ProtobufValue>, segments: string[], value: string): void {
  switch (v.type.tag) {
    case 'message':
      return changeMessageValue(v as Draft<MessageValue>, segments, value);
    case 'primitive':
      return changePrimitiveValue(v as Draft<PrimitiveValue>, segments, value);
    case 'enum':
      return changeEnumValue(v as Draft<EnumValue>, segments, value);
  }
}

function changeMessageValue(msg: Draft<MessageValue>, segments: string[], value: string): void {
  const fieldName = segments[0];
  const [field, repeatedField, oneOfField, mapField] = findField(msg, fieldName);

  if (field) {
    changeValue(field, segments.slice(1), value);
  } else if (repeatedField) {
    const idx = parseInt(segments[1]);
    changeValue(repeatedField[idx], segments.slice(2), value);
  } else if (oneOfField) {
    const [, selectedValue] = oneOfField;
    // although segments[1](subfieldName) isn't used,
    // it's included in the path just in case we later decide that we need it.
    // i.e. rather than keeping just the selected value,
    // we might keep all values to preserve user inputs.
    changeValue(selectedValue, segments.slice(2), value);
  } else if (mapField) {
    const idx = parseInt(segments[1]);
    const isKey = parseInt(segments[2]) === 0;
    if (isKey) {
      mapField[idx][0] = value;
    } else {
      changeValue(mapField[idx][1], segments.slice(3), value);
    }
  }
}

function changePrimitiveValue(v: Draft<PrimitiveValue>, segment: string[], value: string): void {
  console.assert(segment.length === 1 && segment[0] === '');
  v.value = value;
}

function changeEnumValue(v: Draft<EnumValue>, segment: string[], value: string): void {
  console.assert(segment.length === 1 && segment[0] === '');
  v.selected = value;
}

// Change Field Helpers

function changeField(v: Draft<ProtobufValue>, segments: string[], value: string, ctx: ProtoCtx): void {
  switch (v.type.tag) {
    case 'message':
      return changeMessageField(v as Draft<MessageValue>, segments, value, ctx);
    case 'primitive':
      return console.assert(false, "Can't change field of a primitive");
    case 'enum':
      return console.assert(false, "Can't change field of an enum");
  }
}

function changeMessageField(msg: Draft<MessageValue>, segments: string[], value: string, ctx: ProtoCtx): void {
  const fieldName = segments[0];
  const [field, repeatedField, oneOfField, mapField] = findField(msg, fieldName);

  if (field) {
    changeField(field, segments.slice(1), value, ctx);
  } else if (repeatedField) {
    const idx = parseInt(segments[1]);
    changeField(repeatedField[idx], segments.slice(2), value, ctx);
  } else if (oneOfField) {
    const [, selectedValue] = oneOfField;
    if (segments.length === 2) {
      const newTypeName = getByKey(getByKey(msg.type.oneOfFields, fieldName), value);
      if (newTypeName) {
        const newV = typeToDefaultValue(ctx.types[newTypeName], ctx);
        const e = getEntryByKey(msg.oneOfFields, fieldName);
        if (e) {
          e[1] = [value, newV as Draft<ProtobufValue>];
        }
      }
    } else {
      changeField(selectedValue, segments.slice(2), value, ctx);
    }
  } else if (mapField) {
    const idx = parseInt(segments[1]);
    const isKey = parseInt(segments[2]) === 0;
    if (isKey) {
      console.assert(false, "Can't change field of a key");
    } else {
      changeField(mapField[idx][1], segments.slice(3), value, ctx);
    }
  }
}

// Add Entry Helpers

function addEntry(v: Draft<ProtobufValue>, segments: string[], ctx: ProtoCtx): void {
  switch (v.type.tag) {
    case 'message':
      return addMessageEntry(v as Draft<MessageValue>, segments, ctx);
    case 'primitive':
      return console.assert(false, "Can't add entry to a primitive");
    case 'enum':
      return console.assert(false, "Can't add entry to an enum");
  }
}

function addMessageEntry(msg: Draft<MessageValue>, segments: string[], ctx: ProtoCtx): void {
  const fieldName = segments[0];
  const [field, repeatedField, oneOfField, mapField] = findField(msg, fieldName);

  if (field) {
    addEntry(field, segments.slice(1), ctx);
  } else if (repeatedField) {
    if (segments.length === 2) {
      const newTypeName = getByKey(msg.type.repeatedFields, fieldName);
      if (newTypeName) {
        const newV = typeToDefaultValue(ctx.types[newTypeName], ctx);
        repeatedField.push(newV as Draft<ProtobufValue>);
      }
    } else {
      const idx = parseInt(segments[1]);
      addEntry(repeatedField[idx], segments.slice(2), ctx);
    }
  } else if (oneOfField) {
    const [, selectedValue] = oneOfField;
    addEntry(selectedValue, segments.slice(2), ctx);
  } else if (mapField) {
    if (segments.length == 2) {
      const kvTypeNames = getByKey(msg.type.mapFields, fieldName);
      if (kvTypeNames) {
        const [kTypeName, vTypeName] = kvTypeNames;
        const newK = (ctx.types[kTypeName] as PrimitiveType).defaultValue; // guaranteed by protoc
        const newV = typeToDefaultValue(ctx.types[vTypeName], ctx);
        mapField.push([newK, newV as Draft<ProtobufValue>]);
      }
    } else {
      const idx = parseInt(segments[1]);
      const isKey = parseInt(segments[2]) === 0;
      if (isKey) {
        console.assert(false, "Can't add entry to a key");
      } else {
        addEntry(mapField[idx][1], segments.slice(3), ctx);
      }
    }
  }
}

// Remove Entry Helpers

function removeEntry(v: Draft<ProtobufValue>, segments: string[]): void {
  switch (v.type.tag) {
    case 'message':
      return removeMessageEntry(v as Draft<MessageValue>, segments);
    case 'primitive':
      return console.assert(false, "Can't remove entry of a primitive");
    case 'enum':
      return console.assert(false, "Can't remove entry of an enum");
  }
}

function removeMessageEntry(msg: Draft<MessageValue>, segments: string[]): void {
  const fieldName = segments[0];
  const [field, repeatedField, oneOfField, mapField] = findField(msg, fieldName);

  if (field) {
    removeEntry(field, segments.slice(1));
  } else if (repeatedField) {
    const idx = parseInt(segments[1]);
    if (segments.length === 3) {
      delete repeatedField[idx];
    } else {
      removeEntry(repeatedField[idx], segments.slice(2));
    }
  } else if (oneOfField) {
    const [, selectedValue] = oneOfField;
    removeEntry(selectedValue, segments.slice(2));
  } else if (mapField) {
    const idx = parseInt(segments[1]);
    if (segments.length == 3) {
      delete mapField[idx];
    } else {
      const isKey = parseInt(segments[2]) === 0;
      if (isKey) {
        console.assert(false, "Can't remove entry of a key");
      } else {
        removeEntry(mapField[idx][1], segments.slice(3));
      }
    }
  }
}

// helper helper

function findField(
  v: Draft<MessageValue>,
  fieldName: string,
): [
  Draft<ProtobufValue> | undefined,
  Draft<ProtobufValue>[] | undefined,
  [string, Draft<ProtobufValue>] | undefined,
  [string, Draft<ProtobufValue>][] | undefined,
] {
  return [
    getByKey(v.singleFields, fieldName),
    getByKey(v.repeatedFields, fieldName),
    getByKey(v.oneOfFields, fieldName),
    getByKey(v.mapFields, fieldName),
  ];
}
