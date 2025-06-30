import PromotionActions from "./actions";

const initialState = {
  promotions: [],
  selectedPromotion: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPromotions: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  },

  // Filters
  filters: {
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },

  // Statistics
  stats: {
    total: 0,
    active: 0,
    upcoming: 0,
    inactive: 0,
    expired: 0
  }
};

const promotionReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch all promotions
    case PromotionActions.FETCH_ALL_PROMOTIONS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PromotionActions.FETCH_ALL_PROMOTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        promotions: action.payload.promotions || action.payload,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
        stats: {
          ...state.stats,
          ...action.payload.stats,
        },
        filters: {
          ...state.filters,
          ...action.payload.filters,
        },
        error: null,
      };

    case PromotionActions.FETCH_ALL_PROMOTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Create promotion
    case PromotionActions.CREATE_PROMOTION:
      return {
        ...state,
        creating: true,
        error: null,
      };

    case PromotionActions.CREATE_PROMOTION_SUCCESS:
      return {
        ...state,
        creating: false,
        promotions: [action.payload, ...state.promotions],
        totalCount: state.totalCount + 1,
        error: null,
      };

    case PromotionActions.CREATE_PROMOTION_FAILURE:
      return {
        ...state,
        creating: false,
        error: action.payload,
      };

    // Update promotion
    case PromotionActions.UPDATE_PROMOTION:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case PromotionActions.UPDATE_PROMOTION_SUCCESS:
      return {
        ...state,
        updating: false,
        promotions: state.promotions.map((promotion) =>
          promotion._id === action.payload._id ? action.payload : promotion
        ),
        selectedPromotion: action.payload,
        error: null,
      };

    case PromotionActions.UPDATE_PROMOTION_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    // Delete promotion
    case PromotionActions.DELETE_PROMOTION:
      return {
        ...state,
        deleting: true,
        error: null,
      };

    case PromotionActions.DELETE_PROMOTION_SUCCESS:
      return {
        ...state,
        deleting: false,
        promotions: state.promotions.filter(
          (promotion) => promotion._id !== action.payload.id
        ),
        totalCount: state.totalCount - 1,
        error: null,
      };

    case PromotionActions.DELETE_PROMOTION_FAILURE:
      return {
        ...state,
        deleting: false,
        error: action.payload,
      };

    // Get promotion by ID
    case PromotionActions.GET_PROMOTION_BY_ID:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PromotionActions.GET_PROMOTION_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedPromotion: action.payload,
        error: null,
      };

    case PromotionActions.GET_PROMOTION_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Toggle promotion status
    case PromotionActions.TOGGLE_PROMOTION_STATUS:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case PromotionActions.TOGGLE_PROMOTION_STATUS_SUCCESS:
      return {
        ...state,
        updating: false,
        promotions: state.promotions.map((promotion) =>
          promotion._id === action.payload._id ? action.payload : promotion
        ),
        error: null,
      };

    case PromotionActions.TOGGLE_PROMOTION_STATUS_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    // Clear error
    case PromotionActions.CLEAR_PROMOTION_ERROR:
      return {
        ...state,
        error: null,
      };

    // Set filters
    case PromotionActions.SET_PROMOTION_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    // Set pagination
    case PromotionActions.SET_PROMOTION_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    // Reset filters
    case PromotionActions.RESET_PROMOTION_FILTERS:
      return {
        ...state,
        filters: {
          search: '',
          status: 'all',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        },
        pagination: {
          ...state.pagination,
          currentPage: 1,
        },
      };

    default:
      return state;
  }
};

export default promotionReducer;
