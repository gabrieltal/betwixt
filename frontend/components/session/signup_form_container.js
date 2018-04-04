import React from 'react';
import { connect } from 'react-redux';
import { signup } from '../../actions/session_actions';
import SessionForm from './session_form';

const mapStateToProps = (state) => {
  debugger;
  return {
    hi: "yo"
  }
};

const mapDispatchToProps = (dispatch) => ({
  signup: (user) => dispatch(signup(user))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(SessionForm);
