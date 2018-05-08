import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';
import { openModal, closeModal } from '../../actions/modal_actions';
import SessionForm from './session_form';
import { receiveErrors } from '../../actions/session_actions';

const mapStateToProps = (state) => {
  return {
    errors: state.errors.session,
    formType: 'login',
    redirectPageMessage: 'No account? ',
    headerMessage: 'Welcome back.',
    modalMessage:
      'Sign in to access your account. You can like, follow others and write your own stories. Tell your tale. Keep on writing.'
  };
};

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(login(user)),
  otherForm: (
    <button className="other-form-button" onClick={() => dispatch(openModal('signup'))}>Create One.
    </button>
  ),
  closeModal: () => dispatch(closeModal()),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(SessionForm);
