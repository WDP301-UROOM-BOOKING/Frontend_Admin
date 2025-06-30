const PromotionActions = {
  // Fetch all promotions
  FETCH_ALL_PROMOTIONS: "FETCH_ALL_PROMOTIONS",
  FETCH_ALL_PROMOTIONS_SUCCESS: "FETCH_ALL_PROMOTIONS_SUCCESS",
  FETCH_ALL_PROMOTIONS_FAILURE: "FETCH_ALL_PROMOTIONS_FAILURE",

  // Create promotion
  CREATE_PROMOTION: "CREATE_PROMOTION",
  CREATE_PROMOTION_SUCCESS: "CREATE_PROMOTION_SUCCESS",
  CREATE_PROMOTION_FAILURE: "CREATE_PROMOTION_FAILURE",

  // Update promotion
  UPDATE_PROMOTION: "UPDATE_PROMOTION",
  UPDATE_PROMOTION_SUCCESS: "UPDATE_PROMOTION_SUCCESS",
  UPDATE_PROMOTION_FAILURE: "UPDATE_PROMOTION_FAILURE",

  // Delete promotion
  DELETE_PROMOTION: "DELETE_PROMOTION",
  DELETE_PROMOTION_SUCCESS: "DELETE_PROMOTION_SUCCESS",
  DELETE_PROMOTION_FAILURE: "DELETE_PROMOTION_FAILURE",

  // Get promotion by ID
  GET_PROMOTION_BY_ID: "GET_PROMOTION_BY_ID",
  GET_PROMOTION_BY_ID_SUCCESS: "GET_PROMOTION_BY_ID_SUCCESS",
  GET_PROMOTION_BY_ID_FAILURE: "GET_PROMOTION_BY_ID_FAILURE",

  // Toggle promotion status
  TOGGLE_PROMOTION_STATUS: "TOGGLE_PROMOTION_STATUS",
  TOGGLE_PROMOTION_STATUS_SUCCESS: "TOGGLE_PROMOTION_STATUS_SUCCESS",
  TOGGLE_PROMOTION_STATUS_FAILURE: "TOGGLE_PROMOTION_STATUS_FAILURE",

  // Clear errors
  CLEAR_PROMOTION_ERROR: "CLEAR_PROMOTION_ERROR",

  // Pagination and filters
  SET_PROMOTION_FILTERS: "SET_PROMOTION_FILTERS",
  SET_PROMOTION_PAGINATION: "SET_PROMOTION_PAGINATION",
  RESET_PROMOTION_FILTERS: "RESET_PROMOTION_FILTERS",
};

// Action creators
export const fetchAllPromotions = (params) => ({
  type: PromotionActions.FETCH_ALL_PROMOTIONS,
  payload: params
});

export const fetchAllPromotionsSuccess = (data) => ({
  type: PromotionActions.FETCH_ALL_PROMOTIONS_SUCCESS,
  payload: data
});

export const fetchAllPromotionsFailure = (error) => ({
  type: PromotionActions.FETCH_ALL_PROMOTIONS_FAILURE,
  payload: error
});

export const createPromotion = (data) => ({
  type: PromotionActions.CREATE_PROMOTION,
  payload: data
});

export const createPromotionSuccess = (data) => ({
  type: PromotionActions.CREATE_PROMOTION_SUCCESS,
  payload: data
});

export const createPromotionFailure = (error) => ({
  type: PromotionActions.CREATE_PROMOTION_FAILURE,
  payload: error
});

export const updatePromotion = (data) => ({
  type: PromotionActions.UPDATE_PROMOTION,
  payload: data
});

export const updatePromotionSuccess = (data) => ({
  type: PromotionActions.UPDATE_PROMOTION_SUCCESS,
  payload: data
});

export const updatePromotionFailure = (error) => ({
  type: PromotionActions.UPDATE_PROMOTION_FAILURE,
  payload: error
});

export const deletePromotion = (data) => ({
  type: PromotionActions.DELETE_PROMOTION,
  payload: data
});

export const deletePromotionSuccess = (data) => ({
  type: PromotionActions.DELETE_PROMOTION_SUCCESS,
  payload: data
});

export const deletePromotionFailure = (error) => ({
  type: PromotionActions.DELETE_PROMOTION_FAILURE,
  payload: error
});

export const getPromotionById = (data) => ({
  type: PromotionActions.GET_PROMOTION_BY_ID,
  payload: data
});

export const getPromotionByIdSuccess = (data) => ({
  type: PromotionActions.GET_PROMOTION_BY_ID_SUCCESS,
  payload: data
});

export const getPromotionByIdFailure = (error) => ({
  type: PromotionActions.GET_PROMOTION_BY_ID_FAILURE,
  payload: error
});

export const togglePromotionStatus = (data) => ({
  type: PromotionActions.TOGGLE_PROMOTION_STATUS,
  payload: data
});

export const togglePromotionStatusSuccess = (data) => ({
  type: PromotionActions.TOGGLE_PROMOTION_STATUS_SUCCESS,
  payload: data
});

export const togglePromotionStatusFailure = (error) => ({
  type: PromotionActions.TOGGLE_PROMOTION_STATUS_FAILURE,
  payload: error
});

export const clearPromotionError = () => ({
  type: PromotionActions.CLEAR_PROMOTION_ERROR
});

export const setPromotionFilters = (filters) => ({
  type: PromotionActions.SET_PROMOTION_FILTERS,
  payload: filters
});

export const setPromotionPagination = (pagination) => ({
  type: PromotionActions.SET_PROMOTION_PAGINATION,
  payload: pagination
});

export const resetPromotionFilters = () => ({
  type: PromotionActions.RESET_PROMOTION_FILTERS
});

export default PromotionActions;
