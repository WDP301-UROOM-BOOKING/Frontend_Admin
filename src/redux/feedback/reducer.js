import FeedbackActions from "./actions";

const initialState = {
  feedbacks: [],
  error: null,
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case FeedbackActions.DELETE_FEEDBACK_SUCCESS:
      return {
        ...state,
        feedbacks: state.feedbacks.filter((fb) => fb._id !== action.payload),
      };
      case FeedbackActions.UPDATE_FEEDBACK_STATUS_SUCCESS:
        return {
          ...state,
          feedbacks: state.feedbacks.map((fb) =>
            fb._id === action.payload.feedbackId
              ? { ...fb, statusActive: action.payload.status }
              : fb
          ),
        };
    default:
      return state;
  }
};

export default feedbackReducer;
