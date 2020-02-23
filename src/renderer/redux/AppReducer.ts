import { AnyAction } from 'redux';
import { AppState } from '../models/AppState';
import MessageValueViewReducer from '../components/flow/body/MessageValueViewReducer';
import EnvPickerReducer from '../components/toolbar/Env/EnvPickerReducer';
import HeaderViewReducer from '../components/flow/shared/HeaderView/HeaderViewReducer';
import CollectionReducer from '../components/collection/CollectionReducer';
import EndpointInputReducer from '../components/flow/request/EndpointInput/EndpointInputReducer';
import FlowNameViewReducer from '../components/toolbar/FlowName/FlowNameViewReducer';
import BodyInputReducer from '../components/flow/request/BodyInput/BodyInputReducer';
import ProtofileManagerReducer from '../components/collection/protofile/ProtofileManagerReducer';
import FlowViewReducers from '../components/flow/FlowView/FlowViewReducer';

type BigReducer = (s: AppState, a: AnyAction) => AppState;

function applyAll(reducers: BigReducer[]): BigReducer {
  return (s, a): AppState => {
    return reducers.reduce((s, r) => r(s, a), s);
  };
}

const AppReducer = applyAll([
  MessageValueViewReducer,
  EnvPickerReducer,
  HeaderViewReducer,
  CollectionReducer,
  EndpointInputReducer,
  FlowNameViewReducer,
  BodyInputReducer,
  ProtofileManagerReducer,
  FlowViewReducers,
]);

export default AppReducer;
