import { connect } from 'react-redux';
import Comments from './comments';
import { fetchComments } from '../../actions/comment_actions';
import { selectStoryComments } from '../../reducers/selector';
import { createComment, receiveErrors } from '../../actions/comment_actions';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => {
  const currentUser = state.session.currentUser || {id: ''}
  return {
    errors: state.errors.form,
    storyId: ownProps.storyId,
    currentUserId: currentUser.id,
    storyComments: selectStoryComments(state, ownProps.story)
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchComments: () => dispatch(fetchComments()),
  clearErrors: () => dispatch(receiveErrors([])),
  openModal: modal => dispatch(openModal(modal))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
