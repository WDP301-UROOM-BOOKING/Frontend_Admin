import { call, put, takeEvery } from 'redux-saga/effects';
import AdminDashboardActions from './actions';
import AdminDashboardFactories from './factories';

// Fetch admin dashboard metrics
function* fetchAdminDashboardMetrics() {
  yield takeEvery(AdminDashboardActions.FETCH_ADMIN_DASHBOARD_METRICS, function* (action) {
    const { onSuccess, onFailed, params } = action.payload || {};

    try {
      const response = yield call(AdminDashboardFactories.fetchAdminDashboardMetrics, params);

      if (response?.status === 200 && response?.data?.success) {
        const data = response.data?.data;

        yield put({
          type: AdminDashboardActions.FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS,
          payload: data,
        });

        onSuccess?.(data);
      } else {
        const errorMessage = response?.data?.message || "Không thể lấy dữ liệu dashboard.";
        yield put({
          type: AdminDashboardActions.FETCH_ADMIN_DASHBOARD_METRICS_FAILURE,
          payload: errorMessage,
        });
        onFailed?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi server";
      yield put({
        type: AdminDashboardActions.FETCH_ADMIN_DASHBOARD_METRICS_FAILURE,
        payload: errorMessage,
      });
      onFailed?.(errorMessage);
    }
  });
}

export default function* AdminDashboardSaga() {
  yield fetchAdminDashboardMetrics();
}
