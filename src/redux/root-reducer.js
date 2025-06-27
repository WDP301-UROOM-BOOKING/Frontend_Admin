import { combineReducers } from 'redux';
import AuthReducer from './auth/reducer';
import SocketReducer from './socket/socketSlice';
import FeedbackReducer from './feedback/reducer';
import ReportedFeedbackReducer from "./reportedFeedback/reducer";
const rootReducer = combineReducers({
    Auth: AuthReducer,
    Socket: SocketReducer,
    Feedback:FeedbackReducer,
    ReportedFeedback: ReportedFeedbackReducer,
});

export default rootReducer;