import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  // Fetch all promotions with pagination and filters
  fetchAllPromotions: (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    // Add filter params
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${ApiConstants.FETCH_ALL_PROMOTIONS}?${queryParams.toString()}`;
    return api.get(url);
  },

  // Create new promotion
  createPromotion: (data) => {
    return api.post(ApiConstants.CREATE_PROMOTION, data);
  },

  // Update promotion
  updatePromotion: (id, data) => {
    const url = ApiConstants.UPDATE_PROMOTION.replace(":id", id);
    return api.put(url, data);
  },

  // Delete promotion
  deletePromotion: (id) => {
    const url = ApiConstants.DELETE_PROMOTION.replace(":id", id);
    return api.delete(url);
  },

  // Get promotion by ID
  getPromotionById: (id) => {
    const url = ApiConstants.GET_PROMOTION_BY_ID.replace(":id", id);
    return api.get(url);
  },

  // Toggle promotion status
  togglePromotionStatus: (id, status) => {
    const url = ApiConstants.TOGGLE_PROMOTION_STATUS.replace(":id", id);
    return api.patch(url, { isActive: status });
  },

  // ===== PROMOTION USER MANAGEMENT =====

  // Get users who have claimed/used a specific promotion
  getPromotionUsers: (id, params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    // Add filter params
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = ApiConstants.GET_PROMOTION_USERS.replace(":id", id);
    return api.get(`${url}?${queryParams.toString()}`);
  },



  // Get all promotions for a specific user
  getUserPromotions: (userId, params = {}) => {
    const queryParams = new URLSearchParams();

    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = ApiConstants.GET_USER_PROMOTIONS.replace(":userId", userId);
    return api.get(`${url}?${queryParams.toString()}`);
  },

  // Remove user from promotion
  removeUserFromPromotion: (promotionId, userId) => {
    const url = ApiConstants.REMOVE_USER_FROM_PROMOTION
      .replace(":id", promotionId)
      .replace(":userId", userId);
    return api.delete(url);
  },

  // Reset user's usage count for a promotion
  resetUserPromotionUsage: (promotionId, userId) => {
    const url = ApiConstants.RESET_USER_PROMOTION_USAGE
      .replace(":id", promotionId)
      .replace(":userId", userId);
    return api.put(url);
  },


};

export default Factories;
