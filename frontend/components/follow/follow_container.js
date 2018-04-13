import { connect } from 'react-redux';
import Follow from './follow';
import { createFollow, deleteFollow, receiveErrors } from '../../actions/user_actions';
import { openModal, closeModal } from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    user: Object.values(ownProps.author)[0],
    currentUser: state.session.currentUser
  }
};

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(receiveErrors([])),
  openModal: modal => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal()),
  createFollow: (follow) => dispatch(createFollow(follow)),
  deleteFollow: (follow) => dispatch(deleteFollow(follow))
});

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Follow);
