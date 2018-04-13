import React from 'react';
import { connect } from 'react-redux';
import { signup } from '../../actions/session_actions';
import { openModal, closeModal } from '../../actions/modal_actions';
import SessionForm from '../session/session_form';
import { receiveErrors } from '../../actions/session_actions';

const mapStateToProps = (state) => {
  return {
    errors: state.errors.session,
    formType: 'signup',
    redirectPageMessage: 'Already have an account? ',
    headerMessage: 'Never miss any stories from ya boy',
    modalMessage: 'Make an account and follow your favorite writers. Be inspired and try your hand at writing something original!'
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
