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

  // Promotion User Management
  GET_PROMOTION_USERS: "GET_PROMOTION_USERS",
  GET_PROMOTION_USERS_SUCCESS: "GET_PROMOTION_USERS_SUCCESS",
  GET_PROMOTION_USERS_FAILURE: "GET_PROMOTION_USERS_FAILURE",



  GET_USER_PROMOTIONS: "GET_USER_PROMOTIONS",
  GET_USER_PROMOTIONS_SUCCESS: "GET_USER_PROMOTIONS_SUCCESS",
  GET_USER_PROMOTIONS_FAILURE: "GET_USER_PROMOTIONS_FAILURE",

  REMOVE_USER_FROM_PROMOTION: "REMOVE_USER_FROM_PROMOTION",
  REMOVE_USER_FROM_PROMOTION_SUCCESS: "REMOVE_USER_FROM_PROMOTION_SUCCESS",
  REMOVE_USER_FROM_PROMOTION_FAILURE: "REMOVE_USER_FROM_PROMOTION_FAILURE",

  RESET_USER_PROMOTION_USAGE: "RESET_USER_PROMOTION_USAGE",
  RESET_USER_PROMOTION_USAGE_SUCCESS: "RESET_USER_PROMOTION_USAGE_SUCCESS",
  RESET_USER_PROMOTION_USAGE_FAILURE: "RESET_USER_PROMOTION_USAGE_FAILURE",
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

// Promotion User Management Action Creators
export const getPromotionUsers = (params) => ({
  type: PromotionActions.GET_PROMOTION_USERS,
  payload: params
});

export const getPromotionUsersSuccess = (data) => ({
  type: PromotionActions.GET_PROMOTION_USERS_SUCCESS,
  payload: data
});

export const getPromotionUsersFailure = (error) => ({
  type: PromotionActions.GET_PROMOTION_USERS_FAILURE,
  payload: error
});



export const getUserPromotions = (params) => ({
  type: PromotionActions.GET_USER_PROMOTIONS,
  payload: params
});

export const getUserPromotionsSuccess = (data) => ({
  type: PromotionActions.GET_USER_PROMOTIONS_SUCCESS,
  payload: data
});

export const getUserPromotionsFailure = (error) => ({
  type: PromotionActions.GET_USER_PROMOTIONS_FAILURE,
  payload: error
});

export const removeUserFromPromotion = (params) => ({
  type: PromotionActions.REMOVE_USER_FROM_PROMOTION,
  payload: params
});

export const removeUserFromPromotionSuccess = (data) => ({
  type: PromotionActions.REMOVE_USER_FROM_PROMOTION_SUCCESS,
  payload: data
});

export const removeUserFromPromotionFailure = (error) => ({
  type: PromotionActions.REMOVE_USER_FROM_PROMOTION_FAILURE,
  payload: error
});

export const resetUserPromotionUsage = (params) => ({
  type: PromotionActions.RESET_USER_PROMOTION_USAGE,
  payload: params
});

export const resetUserPromotionUsageSuccess = (data) => ({
  type: PromotionActions.RESET_USER_PROMOTION_USAGE_SUCCESS,
  payload: data
});

export const resetUserPromotionUsageFailure = (error) => ({
  type: PromotionActions.RESET_USER_PROMOTION_USAGE_FAILURE,
  payload: error
});

export default PromotionActions;
