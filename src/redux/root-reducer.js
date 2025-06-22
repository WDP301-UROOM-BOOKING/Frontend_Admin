import { combineReducers } from 'redux';
import AuthReducer from './auth/reducer';
import SocketReducer from './socket/socketSlice';

const rootReducer = combineReducers({
    Auth: AuthReducer,
    Socket: SocketReducer,
});

export default rootReducer;