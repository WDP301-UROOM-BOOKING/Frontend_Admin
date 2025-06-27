import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  updateFeedbackStatus: (feedbackId, status) => {
    return api.put(ApiConstants.UPDATE_FEEDBACK_STATUS.replace(":feedbackId", feedbackId), {
      status: status,
    });
  },
    
};

export default Factories;
