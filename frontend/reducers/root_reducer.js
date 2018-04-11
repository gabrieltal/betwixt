import { combineReducers } from 'redux';
import sessionReducer from './session_reducer';
import errorsReducer from './errors_reducer';
import uiReducer from './ui_reducer';
import usersReducer from './users_reducer';
import storiesReducer from './stories_reducer';
import commentsReducer from './comments_reducer';

export default combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  errors: errorsReducer,
  users: usersReducer,
  stories: storiesReducer,
  comments: commentsReducer
});
