import produce, { Draft } from 'immer';
import { AnyAction } from 'redux';
import { BodyInputActionTypes, BodyInputActions } from './BodyInputActions';
import { AppState } from '../../../../models/AppState';
import { getByKey } from '../../../../utils/utils';
import { typeToDefaultValue, MessageValue } from '../../../../models/http/body/protobuf';
import { BODY_TYPES, BodyType } from '../../../../models/http/request_builder';

export default function BodyInputReducer(s: AppState, action: AnyAction): AppState {
  if (BodyInputActionTypes.includes(action.type)) {
    const a = action as BodyInputActions;

    switch (a.type) {
      case 'SELECT_REQUEST_MESSAGE_NAME':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, draft.currentCollection);
          if (!collection) return s;
          const protoCtx = collection.protoCtx;
          const flow = getByKey(collection.flows, draft.currentFlow);
          if (!flow) return s;
          const dv = typeToDefaultValue(protoCtx.types[a.name], protoCtx);
          if (dv.type.tag !== 'message') return s;
          flow.requestBuilder.bodies.protobuf = dv as Draft<MessageValue>;
        });
      case 'SELECT_BODY_TYPE':
        return produce(s, draft => {
          const collection = getByKey(draft.collections, draft.currentCollection);
          if (!collection) return s;
          const flow = getByKey(collection.flows, draft.currentFlow);
          if (!flow) return s;
          if (BODY_TYPES.includes(a.bodyType)) {
            flow.requestBuilder.bodyType = a.bodyType as BodyType;
          }
        });
      default:
        return s;
    }
  }

  return s;
}
