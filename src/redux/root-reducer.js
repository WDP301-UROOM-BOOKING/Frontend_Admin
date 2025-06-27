import { combineReducers } from 'redux';
import AuthReducer from './auth/reducer';
import SocketReducer from './socket/socketSlice';
import FeedbackReducer from './feedback/reducer';
import ReportedFeedbackReducer from "./reportedFeedback/reducer";
import messageReducer from './message/reducer';
const rootReducer = combineReducers({
    Auth: AuthReducer,
    Socket: SocketReducer,
    Feedback:FeedbackReducer,
    ReportedFeedback: ReportedFeedbackReducer,
    Message: messageReducer,
});

export default rootReducer;