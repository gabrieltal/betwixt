import { connect } from 'react-redux';
import UserStoryShow from './user_story_show';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    authoredStories: ownProps.authoredStories,
    currentUser: state.session.currentUser
  };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserStoryShow);
