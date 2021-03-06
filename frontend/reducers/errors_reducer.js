import { combineReducers } from 'redux';
import sessionErrorsReducer from './session_errors_reducer';
import formErrorsReducer from './form_errors_reducer';

const errorsReducer = combineReducers({
  session: sessionErrorsReducer,
  form: formErrorsReducer
});

export default errorsReducer;
