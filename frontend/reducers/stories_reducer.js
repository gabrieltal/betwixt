import { RECEIVE_STORY, RECEIVE_STORIES, REMOVE_STORY } from '../actions/story_actions';
import merge from 'lodash/merge';

const storiesReducer = (oldState={}, action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_STORY:
      return merge({}, action.story);
    case RECEIVE_STORIES:
      return merge({}, action.stories);
    case REMOVE_STORY:
      let newState = merge({}, oldState);
      delete newState[action.storyId];
      return newState;
    default:
      return oldState;
  }
}

export default storiesReducer;
