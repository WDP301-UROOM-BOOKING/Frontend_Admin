import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  getAllReportedFeedbacks: () => {
    return api.get(ApiConstants.GET_ALL_REPORTED_FEEDBACKS);
  },
  getReportsByFeedbackId: (feedbackId) => {
    const url = ApiConstants.GET_REPORTS_BY_FEEDBACK_ID.replace(":feedbackId", feedbackId);
    return api.get(url);
  },
  updateReportStatus: (reportId, body) => {
    const url = ApiConstants.UPDATE_REPORT_STATUS.replace(":reportId", reportId);
    return api.put(url, body);
  },
};


export default Factories;
