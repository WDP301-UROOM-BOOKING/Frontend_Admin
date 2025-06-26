import 'regenerator-runtime/runtime';
import {all} from 'redux-saga/effects';
import AuthSaga from './auth/saga';
import MessageSaga from './message/saga';

export default function* rootSaga() {
  yield all([
    AuthSaga(),
    MessageSaga(),
  ]);
}
