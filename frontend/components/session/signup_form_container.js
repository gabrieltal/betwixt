import React from 'react';
import { connect } from 'react-redux';
import { signup } from '../../actions/session_actions';
import SessionForm from './session_form';
import LoginFormContainer from './login_form_container';

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.errors.session,
    formType: 'signup',
    redirectPageMessage: 'Already have an account? ',
    redirectPageText: 'Sign in',
    headerMessage: 'Join Betwixt.',
    otherForm: ownProps.signInOpenModal,
    navLink: <LoginFormContainer />,
  };
};

const mapDispatchToProps = (dispatch) => ({
  processForm: (user) => dispatch(signup(user))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(SessionForm);
