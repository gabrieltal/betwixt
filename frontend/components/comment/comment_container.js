import { connect } from 'react-redux';
import Comments from './comments';
import { fetchComments } from '../../actions/comment_actions';
import { selectStoryComments } from '../../reducers/selector';

const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.story.id,
    currentUserId: state.session.currentUser,
    storyComments: selectStoryComments(state, ownProps.story)
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchComments: () => dispatch(fetchComments()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
