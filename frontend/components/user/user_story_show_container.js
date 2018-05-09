import { connect } from 'react-redux';
import UserStoryShow from './user_story_show';
import { deleteStory } from '../../actions/story_actions';
import { selectAuthoredStories } from '../../reducers/selector';
import { fetchUserStories } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    authoredStories: selectAuthoredStories(state, user),
    currentUser: state.session.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteStory: (storyId) => dispatch(deleteStory(storyId)),
  fetchUserStories: (userId) => dispatch(fetchUserStories(userId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserStoryShow);
