import { RECEIVE_COMMENT, RECEIVE_COMMENTS, REMOVE_COMMENT } from '../actions/comment_actions';
import merge from 'lodash/merge';

const commentsReducer = (oldState={}, action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_COMMENT:
      return merge({}, action.comment);
    case RECEIVE_COMMENTS:
      return merge({}, action.comments);
    case REMOVE_COMMENT:
      let newState = merge({}, oldState);
      delete newState[action.commentId];
      return newState;
    default:
      return oldState;
  }
}

export default commentsReducer;
