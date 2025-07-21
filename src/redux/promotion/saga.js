import { all, call, fork, put, takeEvery } from "@redux-saga/core/effects";
import PromotionActions, {
  fetchAllPromotionsSuccess,
  fetchAllPromotionsFailure,
  createPromotionSuccess,
  createPromotionFailure,
  updatePromotionSuccess,
  updatePromotionFailure,
  deletePromotionSuccess,
  deletePromotionFailure,
  getPromotionByIdSuccess,
  getPromotionByIdFailure,
  togglePromotionStatusSuccess,
  togglePromotionStatusFailure,
  getPromotionUsersSuccess,
  getPromotionUsersFailure,
  getUserPromotionsSuccess,
  getUserPromotionsFailure,
  removeUserFromPromotionSuccess,
  removeUserFromPromotionFailure,
  resetUserPromotionUsageSuccess,
  resetUserPromotionUsageFailure,
} from "./actions";
import Factories from "./factories";

// 1. Fetch all promotions
function* fetchAllPromotions() {
  yield takeEvery(PromotionActions.FETCH_ALL_PROMOTIONS, function* (action) {
    const { params, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🚀 Redux Saga: Fetching all promotions from API with params:", params);
      const response = yield call(() => Factories.fetchAllPromotions(params));
      console.log("✅ Redux Saga: API Response:", response);

      if (response?.status === 200) {
        yield put(fetchAllPromotionsSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error fetching promotions:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch promotions";
      yield put(fetchAllPromotionsFailure(errorMessage));

      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 2. Create promotion
function* createPromotion() {
  yield takeEvery(PromotionActions.CREATE_PROMOTION, function* (action) {
    const { data, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🚀 Redux Saga: Creating promotion...");
      const response = yield call(() => Factories.createPromotion(data));
      console.log("✅ Redux Saga: Create Response:", response);

      if (response?.status === 201 || response?.status === 200) {
        yield put(createPromotionSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error creating promotion:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create promotion";
      yield put(createPromotionFailure(errorMessage));
      
      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 3. Update promotion
function* updatePromotion() {
  yield takeEvery(PromotionActions.UPDATE_PROMOTION, function* (action) {
    const { id, data, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🚀 Redux Saga: Updating promotion...");
      const response = yield call(() => Factories.updatePromotion(id, data));
      console.log("✅ Redux Saga: Update Response:", response);

      if (response?.status === 200) {
        yield put(updatePromotionSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error updating promotion:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update promotion";
      yield put(updatePromotionFailure(errorMessage));
      
      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 4. Delete promotion
function* deletePromotion() {
  yield takeEvery(PromotionActions.DELETE_PROMOTION, function* (action) {
    const { id, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🚀 Redux Saga: Deleting promotion...");
      const response = yield call(() => Factories.deletePromotion(id));
      console.log("✅ Redux Saga: Delete Response:", response);

      if (response?.status === 200 || response?.status === 204) {
        yield put(deletePromotionSuccess({ id }));
        onSuccess && onSuccess({ id });
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error deleting promotion:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete promotion";
      yield put(deletePromotionFailure(errorMessage));
      
      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 5. Get promotion by ID
function* getPromotionById() {
  yield takeEvery(PromotionActions.GET_PROMOTION_BY_ID, function* (action) {
    const { id, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🚀 Redux Saga: Fetching promotion by ID...");
      const response = yield call(() => Factories.getPromotionById(id));
      console.log("✅ Redux Saga: Get by ID Response:", response);

      if (response?.status === 200) {
        yield put(getPromotionByIdSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error fetching promotion by ID:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch promotion";
      yield put(getPromotionByIdFailure(errorMessage));
      
      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 6. Toggle promotion status
function* togglePromotionStatus() {
  yield takeEvery(PromotionActions.TOGGLE_PROMOTION_STATUS, function* (action) {
    const { id, status, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🚀 Redux Saga: Toggling promotion status...");
      const response = yield call(() => Factories.togglePromotionStatus(id, status));
      console.log("✅ Redux Saga: Toggle Status Response:", response);

      if (response?.status === 200) {
        yield put(togglePromotionStatusSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error toggling promotion status:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to toggle promotion status";
      yield put(togglePromotionStatusFailure(errorMessage));
      
      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// ===== PROMOTION USER MANAGEMENT SAGAS =====

// 6. Get promotion users
function* getPromotionUsers() {
  yield takeEvery(PromotionActions.GET_PROMOTION_USERS, function* (action) {
    const { promotionId, params, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🔄 Redux Saga: Getting promotion users...", { promotionId, params });
      const response = yield call(() => Factories.getPromotionUsers(promotionId, params));
      console.log("✅ Redux Saga: Get Promotion Users Response:", response);

      if (response?.status === 200) {
        yield put(getPromotionUsersSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error getting promotion users:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to get promotion users";
      yield put(getPromotionUsersFailure(errorMessage));

      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 7. Get user promotions
function* getUserPromotions() {
  yield takeEvery(PromotionActions.GET_USER_PROMOTIONS, function* (action) {
    const { userId, params, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🔄 Redux Saga: Getting user promotions...", { userId, params });
      const response = yield call(() => Factories.getUserPromotions(userId, params));
      console.log("✅ Redux Saga: Get User Promotions Response:", response);

      if (response?.status === 200) {
        yield put(getUserPromotionsSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error getting user promotions:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to get user promotions";
      yield put(getUserPromotionsFailure(errorMessage));

      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 9. Remove user from promotion
function* removeUserFromPromotion() {
  yield takeEvery(PromotionActions.REMOVE_USER_FROM_PROMOTION, function* (action) {
    const { promotionId, userId, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🔄 Redux Saga: Removing user from promotion...", { promotionId, userId });
      const response = yield call(() => Factories.removeUserFromPromotion(promotionId, userId));
      console.log("✅ Redux Saga: Remove User Response:", response);

      if (response?.status === 200) {
        yield put(removeUserFromPromotionSuccess({ ...response.data, removedUserId: userId }));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error removing user from promotion:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to remove user from promotion";
      yield put(removeUserFromPromotionFailure(errorMessage));

      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}

// 10. Reset user promotion usage
function* resetUserPromotionUsage() {
  yield takeEvery(PromotionActions.RESET_USER_PROMOTION_USAGE, function* (action) {
    const { promotionId, userId, onSuccess, onFailed, onError } = action.payload || {};

    try {
      console.log("🔄 Redux Saga: Resetting user promotion usage...", { promotionId, userId });
      const response = yield call(() => Factories.resetUserPromotionUsage(promotionId, userId));
      console.log("✅ Redux Saga: Reset Usage Response:", response);

      if (response?.status === 200) {
        yield put(resetUserPromotionUsageSuccess(response.data));
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Redux Saga: Error resetting user promotion usage:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset user promotion usage";
      yield put(resetUserPromotionUsageFailure(errorMessage));

      const status = error.response?.status;
      if (status >= 500) {
        onError && onError(error);
      } else {
        onFailed && onFailed(errorMessage);
      }
    }
  });
}



export default function* promotionSaga() {
  yield all([
    fork(fetchAllPromotions),
    fork(createPromotion),
    fork(updatePromotion),
    fork(deletePromotion),
    fork(getPromotionById),
    fork(togglePromotionStatus),
    fork(getPromotionUsers),
    fork(getUserPromotions),
    fork(removeUserFromPromotion),
    fork(resetUserPromotionUsage),
  ]);
}
