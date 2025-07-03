import { combineReducers } from 'redux';
import AuthReducer from './auth/reducer';
import SocketReducer from './socket/socketSlice';
import FeedbackReducer from './feedback/reducer';
import ReportedFeedbackReducer from "./reportedFeedback/reducer";
import messageReducer from './message/reducer';
import PromotionReducer from './promotion/reducer';
import AdminDashboardReducer from './adminDashboard/reducer';

const rootReducer = combineReducers({
    Auth: AuthReducer,
    Socket: SocketReducer,
    Feedback:FeedbackReducer,
    ReportedFeedback: ReportedFeedbackReducer,
    Message: messageReducer,
    Promotion: PromotionReducer,
    AdminDashboard: AdminDashboardReducer,
});

export default rootReducer;