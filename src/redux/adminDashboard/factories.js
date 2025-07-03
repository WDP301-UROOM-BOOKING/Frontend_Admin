import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api";

const AdminDashboardFactories = {
  fetchAdminDashboardMetrics: (params) => 
    api.get(ApiConstants.ADMIN_DASHBOARD_METRICS, { params }),
};

export default AdminDashboardFactories;
