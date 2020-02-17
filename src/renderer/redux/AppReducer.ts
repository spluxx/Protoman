import { AnyAction } from 'redux';
import { AppState } from '../models/AppState';
import MessageValueViewReducer from '../components/flow/body/MessageValueViewReducer';
import EnvPickerReducer from '../components/toolbar/Env/EnvPickerReducer';
import HeaderViewReducer from '../components/flow/shared/HeaderView/HeaderViewReducer';
import CollectionReducer from '../components/collection/CollectionReducer';
import EndpointInputReducer from '../components/flow/request/EndpointInput/EndpointInputReducer';
import FlowNameViewReducer from '../components/toolbar/FlowName/FlowNameViewReducer';

type BigReducer = (s: AppState, a: AnyAction) => AppState;

function applyAll(reducers: BigReducer[]): BigReducer {
  return (s, a): AppState => {
    console.log(a);
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
]);

export default AppReducer;
