import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import merge from 'lodash/merge';
import { RECEIVE_FOLLOW, REMOVE_FOLLOW, RECEIVE_LIKE, REMOVE_LIKE } from '../actions/user_actions';

const _nullUser = Object.freeze({
    currentUser: null
});

const sessionReducer = (oldState=_nullUser, action) => {
  Object.freeze(oldState);
  let newState;
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      const currentUser = action.currentUser;
      return merge({}, { currentUser });
    case RECEIVE_FOLLOW:
      newState = merge({}, oldState);
      Object.values(Object.values(newState)[0])[0].following.push(action.follow.following_id);
      return merge({}, newState);
    case RECEIVE_LIKE:
      newState = merge({}, oldState);
      Object.values(Object.values(newState)[0])[0].likes.push(action.like.story_id);
      return newState;
    case REMOVE_LIKE:
      newState = merge({}, oldState);
      let index = Object.values(Object.values(newState)[0])[0].likes.indexOf(action.like.story_id);
      Object.values(Object.values(newState)[0])[0].likes.splice(index, 1);
      return newState;

    default:
      return oldState;
  }
}

export default sessionReducer;
