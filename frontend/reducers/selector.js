import values from 'lodash/values';

export const selectAuthoredStories = (state, author) => {
  return author ? author.authoredStories.map(id => state.stories[id]) : [];
};
