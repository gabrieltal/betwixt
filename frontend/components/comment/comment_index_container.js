import { connect } from 'react-redux';
import CommentIndex from './comment_index';
import { fetchComments, receiveErrors } from '../../actions/comment_actions';
const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.story.id,
    story: ownProps.story,
    currentUser: state.session.currentUser,
    storyComments: state.comments
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchComments: (storyId) => dispatch(fetchComments(storyId)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentIndex);
