import { RECEIVE_STORY, RECEIVE_STORIES, REMOVE_STORY } from '../actions/story_actions';
import merge from 'lodash/merge';
import { RECEIVE_LIKE, REMOVE_LIKE } from '../actions/user_actions';

const storiesReducer = (oldState={}, action) => {
  Object.freeze(oldState);
  let newState;
  switch (action.type) {
    case RECEIVE_STORY:
      return merge({}, oldState, action.story);
    case RECEIVE_STORIES:
      return merge({}, action.stories);
    case REMOVE_STORY:
      newState = merge({}, oldState);
      delete newState[action.storyId];
      return newState;
    case RECEIVE_LIKE:
      newState = merge({}, oldState);
      Object.values(newState)[0]["likes"].push(action.like.user_id);
      return newState;
    case REMOVE_LIKE:
      newState = merge({}, oldState);
      let nsArray = Object.values(newState)[0];
      let idxOfState = Object.keys(newState)[0];
      let index = nsArray.likes.indexOf(action.like.user_id);
      nsArray.likes.splice(index, 1);
      return merge({}, {[idxOfState]: nsArray});
    default:
      return oldState;
  }
}

export default storiesReducer;
