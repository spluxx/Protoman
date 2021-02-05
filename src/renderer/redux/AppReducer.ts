import { AnyAction } from 'redux';
import { AppState } from '../models/AppState';
import MessageValueViewReducer from '../components/Flow/body/MessageValueViewReducer';
import EnvPickerReducer from '../components/toolbar/Env/EnvPickerReducer';
import HeaderViewReducer from '../components/Flow/shared/HeaderView/HeaderViewReducer';
import CollectionReducer from '../components/Collection/CollectionReducer';
import EndpointInputReducer from '../components/Flow/request/EndpointInput/EndpointInputReducer';
import FlowNameViewReducer from '../components/toolbar/FlowName/FlowNameViewReducer';
import BodyInputReducer from '../components/Flow/request/BodyInput/BodyInputReducer';
import ProtofileManagerReducer from '../components/Collection/protofile/ProtofileManagerReducer';
import CacheReducer from '../components/cache/CacheReducer';
import FlowViewReducers from '../components/Flow/FlowView/FlowViewReducer';
import ExpectedBodyInputReducer from '../components/Flow/request/ExpectedBodyInput/ExpectedBodyInputReducer';
import BulkReducer from '../bulk/BulkReducer';

type BigReducer = (s: AppState, a: AnyAction) => AppState;

function applyAll(reducers: BigReducer[]): BigReducer {
  return (s, a): AppState => {
    return reducers.reduce((s, r) => r(s, a), s);
  };
}

function Logger(s: AppState, a: AnyAction): AppState {
  console.log(a);
  return s;
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
  ExpectedBodyInputReducer,
  BulkReducer,
  CacheReducer,
  // Logger,
]);

export default AppReducer;
