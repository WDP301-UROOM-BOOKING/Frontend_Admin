import {
  FETCH_ADMIN_DASHBOARD_METRICS,
  FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS,
  FETCH_ADMIN_DASHBOARD_METRICS_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  error: null,
  data: {
    // Overview stats
    totalHotels: 0,
    activeHotels: 0,
    pendingApprovals: 0,
    totalCustomers: 0,
    totalOwners: 0,
    totalReservations: 0,
    totalRevenue: 0,
    pendingReports: 0,
    
    // Chart data
    revenueData: {
      labels: [],
      datasets: []
    },
    
    // Distribution data
    hotelDistributionData: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }]
    },
    
    hotelCategoryData: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }]
    },
    
    // Recent activities
    recentApprovals: [],
    recentReports: []
  }
};

const AdminDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_DASHBOARD_METRICS:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_ADMIN_DASHBOARD_METRICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: {
          ...state.data,
          ...action.payload
        }
      };

    case FETCH_ADMIN_DASHBOARD_METRICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default AdminDashboardReducer;
