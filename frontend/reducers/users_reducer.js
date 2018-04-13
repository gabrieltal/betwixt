import {
  RECEIVE_USER, RECEIVE_LIKE, REMOVE_LIKE, RECEIVE_FOLLOW, REMOVE_FOLLOW
} from '../actions/user_actions';
import merge from 'lodash/merge';
const usersReducer = (oldState={}, action) => {
  let newState;
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_USER:
      return merge({}, action.user);
    case RECEIVE_LIKE:
      newState = merge({}, oldState);
      Object.values(newState)[0]["likes"].push(action.like.story_id);
      return newState;
    case REMOVE_LIKE:
      newState = merge({}, oldState);
      let nsArray = Object.values(newState)[0];
      let idxOfState = Object.keys(newState)[0];
      let index = nsArray.likes.indexOf(action.like.id);
      nsArray.likes.splice(index, 1);
      return merge({}, {[idxOfState]: nsArray});
    case RECEIVE_FOLLOW:
      newState = merge({}, oldState);
      Object.values(newState)[0].followers.push(action.follow.follower_id);
      return merge({}, newState);
    default:
      return oldState;
  }
}

export default usersReducer;
