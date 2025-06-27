import ReportFeedbackActions from "./actions";
const initialState = {
  status: null,
  error: null,
  allReportedFeedbacks: [],
  feedbackReports: [],
};
const reportFeedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReportFeedbackActions.GET_ALL_REPORTED_FEEDBACKS_SUCCESS:
      return {
        ...state,
        allReportedFeedbacks: action.payload,
        error: null,
      };
    case ReportFeedbackActions.GET_REPORTS_BY_FEEDBACK_ID_SUCCESS:
      return {
        ...state,
        feedbackReports: action.payload,
        error: null,
      };
    case ReportFeedbackActions.UPDATE_REPORT_STATUS_SUCCESS:
      return {
        ...state,
        feedbackReports: state.feedbackReports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        ),
      };

    default:
      return state;
  }
};

export default reportFeedbackReducer;
