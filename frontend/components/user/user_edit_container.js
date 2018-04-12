import { connect } from 'react-redux';
import UserEditForm from './user_edit_form';
import { clearErrors, updateUser, receiveErrors } from '../../actions/user_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    userId: ownProps.match.params.userId,
    user: state.session.currentUser,
    errors: state.errors.form || [],
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(receiveErrors([])),
  updateUser: (user) => dispatch(updateUser(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserEditForm);
