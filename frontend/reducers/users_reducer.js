import {
  RECEIVE_USER, RECEIVE_LIKE, REMOVE_LIKE, RECEIVE_FOLLOW, REMOVE_FOLLOW
} from '../actions/user_actions';
import merge from 'lodash/merge';
const usersReducer = (oldState={}, action) => {
  let newState;
  let index;
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_USER:
      return merge({}, oldState, action.user);
    case RECEIVE_LIKE:
      newState = merge({}, oldState);
      console.log(newState);
      Object.values(newState)[0]["likes"].push(action.like.story_id);
      return newState;
    case REMOVE_LIKE:
      newState = merge({}, oldState);
      let nsArray = Object.values(newState)[0];
      let idxOfState = Object.keys(newState)[0];
      index = nsArray.likes.indexOf(action.like.id);
      nsArray.likes.splice(index, 1);
      return merge({}, {[idxOfState]: nsArray});
    case RECEIVE_FOLLOW:
      newState = merge({}, oldState);
      Object.values(newState)[0].followers.push(action.follow.follower_id);
      return merge({}, newState);
    case REMOVE_FOLLOW:
      newState = merge({}, oldState);
      index = Object.values(newState)[0].followers.indexOf(action.follow.follower_id);
      Object.values(newState)[0].followers.splice(index, 1);
      return newState;
    default:
      return oldState;
  }
}

export default usersReducer;
