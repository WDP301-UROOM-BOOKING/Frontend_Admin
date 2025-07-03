import 'regenerator-runtime/runtime';
import {all} from 'redux-saga/effects';
import AuthSaga from './auth/saga';
import FeedbackSaga from './feedback/saga';
import ReportFeedbackSaga from "./reportedFeedback/saga";
import MessageSaga from './message/saga';
import PromotionSaga from './promotion/saga';
import AdminDashboardSaga from './adminDashboard/saga';

export default function* rootSaga() {
  yield all([
    AuthSaga(),
    FeedbackSaga(),
    ReportFeedbackSaga(),
    MessageSaga(),
    PromotionSaga(),
    AdminDashboardSaga(),
  ]);
}
