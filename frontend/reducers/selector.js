import values from 'lodash/values';

export const selectAuthoredStories = (state, author) => {
  return author ? author.authoredStories.map(id => state.stories[id]) : [];
};

export const selectStoryComments = (state, story) => {
  return story ? story.comments.map(id => state.comments[id]) : [];
};
