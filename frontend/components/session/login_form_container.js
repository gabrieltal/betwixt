import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';
import SessionForm from './session_form';
import SignupFormContainer from './signup_form_container';

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.errors.session,
    formType: 'login',
    redirectPageMessage: 'No account? ',
    redirectPageText: 'Create one',
    headerMessage: 'Welcome back.',
    otherForm: ownProps.signUpOpenModal,
    navLink: <SignupFormContainer />,
  };
};

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(login(user))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(SessionForm);
