import { connect } from 'react-redux';
import Follow from './follow';
import { createFollow, deleteFollow, receiveErrors, fetchUser } from '../../actions/user_actions';
import { openModal, closeModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    userId: ownProps.user,
    currentUser: state.session.currentUser
  }
};

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(receiveErrors([])),
  openModal: modal => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal()),
  createFollow: (follow) => dispatch(createFollow(follow)),
  deleteFollow: (follow) => dispatch(deleteFollow(follow)),
  fetchUser: (userId) => dispatch(fetchUser(userId))
});

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Follow);
