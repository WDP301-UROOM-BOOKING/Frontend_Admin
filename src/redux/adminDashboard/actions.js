// Admin Dashboard Actions
export const FETCH_ADMIN_DASHBOARD_METRICS = 'FETCH_ADMIN_DASHBOARD_METRICS';
export const FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS = 'FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS';
export const FETCH_ADMIN_DASHBOARD_METRICS_FAILURE = 'FETCH_ADMIN_DASHBOARD_METRICS_FAILURE';

const AdminDashboardActions = {
  FETCH_ADMIN_DASHBOARD_METRICS,
  FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS,
  FETCH_ADMIN_DASHBOARD_METRICS_FAILURE,

  // Action creators
  fetchAdminDashboardMetrics: (payload) => ({
    type: FETCH_ADMIN_DASHBOARD_METRICS,
    payload
  }),

  fetchAdminDashboardMetricsSuccess: (data) => ({
    type: FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS,
    payload: data
  }),

  fetchAdminDashboardMetricsFailure: (error) => ({
    type: FETCH_ADMIN_DASHBOARD_METRICS_FAILURE,
    payload: error
  })
};

export default AdminDashboardActions;
