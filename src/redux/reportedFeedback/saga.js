import { all, call, fork, put, takeEvery } from "@redux-saga/core/effects";
import ReportFeedbackActions from "./actions";
import Factories from "./factories";

// Get tất cả các feedback đã bị report (cho admin)
function* getAllReportedFeedbacks() {
  yield takeEvery(ReportFeedbackActions.GET_ALL_REPORTED_FEEDBACKS, function* (action) {
    const { onSuccess, onFailed } = action.payload || {};

    try {
      const response = yield call(Factories.getAllReportedFeedbacks);

      if (response?.status === 200 && response?.data?.error === false) {
        const data = response.data?.data;

        yield put({
          type: ReportFeedbackActions.GET_ALL_REPORTED_FEEDBACKS_SUCCESS,
          payload: data,
        });

        onSuccess?.(data);
      } else {
        onFailed?.(response?.data?.message || "Không thể lấy danh sách báo cáo.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi server";
      onFailed?.(msg);
    }
  });
}
function* getReportsByFeedbackId() {
  yield takeEvery(ReportFeedbackActions.GET_REPORTS_BY_FEEDBACK_ID, function* (action) {
    const { feedbackId, onSuccess, onFailed } = action.payload || {};
    try {
      const response = yield call(Factories.getReportsByFeedbackId, feedbackId);
      if (response?.status === 200 && response?.data?.error === false) {
        const data = response.data?.data;
        yield put({
          type: ReportFeedbackActions.GET_REPORTS_BY_FEEDBACK_ID_SUCCESS,
          payload: data,
        });
        onSuccess?.(data);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi server";
      onFailed?.(msg);
    }
  });
}
function* updateReportStatus() {
  yield takeEvery(ReportFeedbackActions.UPDATE_REPORT_STATUS, function* (action) {
    const { reportId, data, onSuccess, onFailed } = action.payload || {};

    try {
      const response = yield call(Factories.updateReportStatus, reportId, data);
      if (response?.status === 200 && response?.data?.error === false) {
        const updatedReport = response.data?.data;

        yield put({
          type: ReportFeedbackActions.UPDATE_REPORT_STATUS_SUCCESS,
          payload: updatedReport,
        });

        onSuccess?.(updatedReport);
      } else {
        onFailed?.(response?.data?.message || "Không thể cập nhật trạng thái.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi server";
      onFailed?.(msg);
    }
  });
}

export default function* feedbackSaga() {
  yield all([
    fork(getAllReportedFeedbacks),
    fork(getReportsByFeedbackId),
    fork(updateReportStatus),
  ]);
}
