import { all, call, fork, put, takeEvery } from "@redux-saga/core/effects";
import FeedbackActions from "./actions";
import Factories from "./factories";

function* updateFeedbackStatus() {
  yield takeEvery(FeedbackActions.UPDATE_FEEDBACK_STATUS, function* (action) {
    const { feedbackId, status, onSuccess, onFailed, onError } = action.payload;

    try {
      const response = yield call(() =>
        Factories.updateFeedbackStatus(feedbackId, status)
      );

      if (response?.status === 200 && response?.data?.error === false) {
        yield put({
          type: FeedbackActions.UPDATE_FEEDBACK_STATUS_SUCCESS,
          payload: { feedbackId, status },
        });
        onSuccess?.();
      } else {
        onFailed?.(response?.data?.message || "Không thể cập nhật trạng thái feedback");
      }
    } catch (error) {
      const statusCode = error.response?.status;
      const msg = error.response?.data?.message || "Lỗi server";

      if (statusCode >= 500) {
        onError?.(error);
      } else {
        onFailed?.(msg);
      }
    }
  });
}


export default function* feedbackSaga() {
  yield all([
    fork(updateFeedbackStatus), 
  ]);
}
