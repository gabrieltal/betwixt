import { connect } from 'react-redux';
import Comments from './comments';
import {fetchComments } from '../../actions/comment_actions';
const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.story.id,
    story: ownProps.story,
    currentUser: state.session.currentUser,
    storyComments: state.comments
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchComments: (storyId) => dispatch(fetchComments(storyId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
