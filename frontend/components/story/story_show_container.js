import { connect } from 'react-redux';
import StoryShow from './story_show';
import { fetchStories, fetchStory } from '../../actions/story_actions';
import { fetchUser } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  const story = state.stories[ownProps.match.params.storyId];
  return {
    storyId: ownProps.match.params.storyId,
    authorId: ownProps.match.params.authorId,
    story,
    author: state.users[ownProps.match.params.authorId]
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (id) => dispatch(fetchStory(id)),
  fetchUser: (id) => dispatch(fetchUser(id))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(StoryShow);
