import { connect } from 'react-redux';
import UserStoryShow from './user_story_show';
import { deleteStory } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    authoredStories: ownProps.authoredStories,
    currentUser: state.session.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteStory: (storyId) => dispatch(deleteStory(storyId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserStoryShow);
