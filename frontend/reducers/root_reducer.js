import { combineReducers } from 'redux';
import sessionReducer from './session_reducer';
import errorsReducer from './errors_reducer';
import uiReducer from './ui_reducer';
import usersReducer from './users_reducer';

export default combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  errors: errorsReducer,
  users: usersReducer
});
