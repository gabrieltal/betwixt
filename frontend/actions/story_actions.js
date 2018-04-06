import * as ApiStory from '../util/story_api_util';
export const RECEIVE_STORY = "RECEIVE_STORY";
export const RECEIVE_STORIES = "RECEIVE_STORIES";
export const REMOVE_STORY = "REMOVE_STORY";
export const RECEIVE_FORM_ERRORS = "RECEIVE_FORM_ERRORS";

export const fetchStory = (id) => (dispatch) => (
  ApiStory.fetchStory(id).then((story) => dispatch(receiveStory(story)))
);

export const fetchStories = () => (dispatch) => (
  ApiStory.fetchStories().then((stories) => dispatch(receiveStories(stories)))
);

export const createStory = (story) => (dispatch) => (
  ApiStory.createStory(story).then((story) => dispatch(receiveStory(story)),
  (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const updateStory = (story) => (dispatch) => (
  ApiStory.updateStory(story).then((story) => dispatch(receiveStory(story)),
  (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const deleteStory = (storyId) => (dispatch) => (
  ApiStory.deleteStory(storyId).then((story) => dispatch(removeStory(storyId)))
);

const removeStory = (storyId) => ({
  type: REMOVE_STORY,
  storyId
});

const receiveStories = (stories) => ({
  type: RECEIVE_STORIES,
  stories
});

const receiveStory = (story) => ({
  type: RECEIVE_STORY,
  story
});

const receiveErrors = (errors) => ({
  type: RECEIVE_FORM_ERRORS,
  errors
});
