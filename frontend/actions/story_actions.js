import * as ApiStory from '../util/story_api_util';
export const RECEIVE_STORY = "RECEIVE_STORY";
export const RECEIVE_STORIES = "RECEIVE_STORIES";
export const REMOVE_STORY = "REMOVE_STORY";
export const RECEIVE_FORM_ERRORS = "RECEIVE_FORM_ERRORS";
export const RECEIVE_SEARCH_STORIES = "RECEIVE_SEARCH_STORIES";

export const fetchStory = (id) => (dispatch) => (
  ApiStory.fetchStory(id).then((story) => dispatch(receiveStory(story)))
);

export const searchTaggedStories = (tag) => (dispatch) => (
  ApiStory.searchTaggedStories(tag).then((stories) => dispatch(receiveSearchStories(stories)),
  (errors) => dispatch(receiveErrors(errors.responseJSON)))
);

export const fetchLikedStories = (userId) => (dispatch) => (
  ApiStory.fetchLikedStories(userId).then((stories) => dispatch(receiveStories(stories)))
)

export const fetchUserStories = (authorId) => (dispatch) => (
  ApiStory.fetchUserStories(authorId).then(stories => dispatch(receiveStories(stories)))
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
    (errors) => dispatch(receiveErrors(errors.responseJSON))
));

export const deleteStory = (storyId) => (dispatch) => (
  ApiStory.deleteStory(storyId).then((story) => dispatch(removeStory(story.id)))
);

const removeStory = (storyId) => ({
  type: REMOVE_STORY,
  storyId
});

const receiveSearchStories = (stories) => ({
  type: RECEIVE_SEARCH_STORIES,
  stories
})

const receiveStories = (stories) => ({
  type: RECEIVE_STORIES,
  stories
});

export const receiveStory = (story) => ({
  type: RECEIVE_STORY,
  story
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_FORM_ERRORS,
  errors
});
