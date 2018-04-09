import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStories, fetchStory } from '../../actions/story_actions';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  const story = state.stories[ownProps.match.params.storyId];
  return {
    storyId: ownProps.match.params.storyId,
    authorId: story.author_id,
    story,
    author: state.users[story.author_id]
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (id) => dispatch(fetchStory(id)),
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
