import { combineReducers } from 'redux';
import AuthReducer from './auth/reducer';
import SocketReducer from './socket/socketSlice';
import messageReducer from './message/reducer';

const rootReducer = combineReducers({
    Auth: AuthReducer,
    Socket: SocketReducer,
    Message: messageReducer,
});

export default rootReducer;