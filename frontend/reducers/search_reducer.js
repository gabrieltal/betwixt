import { RECEIVE_SEARCH_STORIES } from '../actions/story_actions';
import { RECEIVE_SEARCH_USERS } from '../actions/user_actions';
import merge from 'lodash/merge';

const searchReducer = (oldState={stories: {}, users: {}}, action) => {
  Object.freeze(oldState);
  let stories;
  let users;
  switch (action.type) {
    case RECEIVE_SEARCH_STORIES:
      users = oldState.users
      return merge({}, {stories: action.stories, users});
    case RECEIVE_SEARCH_USERS:
      stories = oldState.stories
      return merge({}, {users: action.users, stories});
    default:
      return oldState;
  }
}

export default searchReducer;
