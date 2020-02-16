import { AnyAction } from 'redux';
import { AppState } from '../models/AppState';
import MessageValueViewReducer from '../components/flow/body/MessageValueViewReducer';

type BigReducer = (s: AppState, a: AnyAction) => AppState;

function applyAll(reducers: BigReducer[]): BigReducer {
  return (s, a): AppState => reducers.reduce((s, r) => r(s, a), s);
}

const AppReducer = applyAll([MessageValueViewReducer]);

export default AppReducer;
