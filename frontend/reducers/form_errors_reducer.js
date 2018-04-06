import { RECEIVE_FORM_ERRORS, RECEIVE_STORY } from '../actions/story_actions';

const formErrorsReducer = (oldState=[], action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_STORY:
      return [];
    case RECEIVE_FORM_ERRORS:
      return action.errors;
    default:
      return oldState;
  }
}

export default formErrorsReducer;
