import { connect } from 'react-redux';
import UserStoryShow from './user_story_show';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.user;
  return {
    user,
    authoredStories: ownProps.authoredStories
  };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserStoryShow);
