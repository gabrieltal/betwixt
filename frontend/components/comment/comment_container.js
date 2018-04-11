import { connect } from 'react-redux';
import Comments from './comments';
import { fetchComment } from '../../actions/comment_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    storyId: ownProps.story.id,
    currentUser: state.session.currentUser,
    storyComments: ownProps.story.comments,
    comments: state.comments
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchComment: (id) => dispatch(fetchComment(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
