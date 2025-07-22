import { all, call, fork, put, takeEvery } from "@redux-saga/core/effects";
import Factories from "./factories";
import HotelActions from "./actions";

function* getHotelsNotApprovalSaga() {
  yield takeEvery(HotelActions.FETCH_HOTELS_NOT_APPROVAL, function* (action) {
    const { onSuccess, onFailed, onError } = action.payload || {};

    try {
      const response = yield call(Factories.getHotelsNotApproval);
      console.log('response >> ', response)
      if (response?.status === 200) {
        yield put({
          type: HotelActions.FETCH_HOTELS_NOT_APPROVAL_SUCCESS,
          payload: response.data, // hoặc response.data.data nếu bạn bọc trong { data: [...] }
        });
        onSuccess?.(response.data);
      } else {
        onFailed?.(response?.data?.message || "Failed to fetch refunding reservations");
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Something went wrong";


      if (status >= 500) {
        onError?.(error);
      } else {
        onFailed?.(msg);
      }
    }
  });
}


export default function* userSaga() {
  yield all([
    fork(getHotelsNotApprovalSaga),
  ]);
}
