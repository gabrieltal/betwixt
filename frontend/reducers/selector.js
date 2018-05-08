export const selectAuthoredStories = (state, author) => {
  return author ? author.authoredStories.map(id => state.stories[id]) : [];
};

export const selectAuthoredComments = (state, author) => {
  return author ? author.comments.map(id => state.comments[id]) : [];
}
const sortStories = (stories, userFollowing) => {
  if (!!stories[1]) {
    let storiesIndex = [];
    Object.values(stories).forEach((story) => {
      if (userFollowing.includes(story.author_id)) {
        storiesIndex.unshift(story);
      } else {
        storiesIndex.push(story);
      }
    });
    return storiesIndex;
  }
  return [];
};

export const getFollowingStoriesFirst = (state, user) => {
  return user ? sortStories(state.stories, Object.values(user)[0].following) : [];
};
