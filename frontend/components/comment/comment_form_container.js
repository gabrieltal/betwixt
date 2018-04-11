import { connect } from 'react-redux';
import CommentForm from './comment_form';
import { createComment, receiveErrors } from '../../actions/comment_actions';
import { openModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.errors.form,
    storyId: ownProps.storyId,
    currentUser: state.session.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(receiveErrors([])),
  openModal: modal => dispatch(openModal(modal)),
  createComment: (comment) => dispatch(createComment(comment))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentForm);
