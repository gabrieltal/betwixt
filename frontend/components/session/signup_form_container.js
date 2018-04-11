import React from 'react';
import { connect } from 'react-redux';
import { signup } from '../../actions/session_actions';
import SessionForm from './session_form';
import { openModal, closeModal } from '../../actions/modal_actions';
import { receiveErrors } from '../../actions/session_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.errors.session,
    formType: 'signup',
    redirectPageMessage: 'Already have an account? ',
    headerMessage: 'Join Betwixt.',
    modalMessage:
      'Create an account join all the fun. All your friends are doing it. Write your own stories. Like other stories. Read more, it is good for you. Join today.'
  };
};

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(signup(user)),
  otherForm: (
    <button className="other-form-button" onClick={() => dispatch(openModal('login'))}>Login.
    </button>
  ),
  closeModal: () => dispatch(closeModal()),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(SessionForm);
