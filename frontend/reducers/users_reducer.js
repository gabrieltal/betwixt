import {
  RECEIVE_USER
} from '../actions/user_actions';
import merge from 'lodash/merge';

const usersReducer = (oldState={}, action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_USER:
      return merge({}, oldState, {[action.user.id]: action.user});
    default:
      return oldState;
  }
};

export default usersReducer;
