import {
  RECEIVE_USER, RECEIVE_LIKE, REMOVE_LIKE
} from '../actions/user_actions';
import merge from 'lodash/merge';
const usersReducer = (oldState={}, action) => {
  console.log(action.like);
  console.log(oldState);
  let newState;
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_USER:
      return merge({}, action.user);
    case RECEIVE_LIKE:
      newState = merge({}, oldState);
      Object.values(newState)[0]["likes"].push(action.like.id);
      return newState;
    case REMOVE_LIKE:
      newState = merge({}, oldState);
      let nsArray = Object.values(newState)[0];
      let idxOfState = Object.keys(newState)[0];
      let index = nsArray.indexOf(action.like.id);
      return merge({}, {[idxOfState]: nsArray.splice(index, 1)});
    default:
      return oldState;
  }
}

export default usersReducer;
