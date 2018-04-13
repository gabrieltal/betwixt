import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import CommentLoginFormContainer from './comment_login_form_container';
import LikeLoginFormContainer from './like_login_container';
const Modal = ({ modal, closeModal }) => {
  if (!modal) {
    return null;
  }

  let component;
  switch (modal) {
    case 'login':
      component = <LoginFormContainer />;
      break;
    case 'signup':
      component = <SignupFormContainer />;
      break;
    case 'comment-login':
      component = <CommentLoginFormContainer />;
      break;
    case 'like-login':
      component = <LikeLoginFormContainer />;
      break;
    default:
      return null;
  }

  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-child" onClick={ e => {
        e.stopPropagation();
        if (e.target.innerText === 'Create One.' ||
            e.target.innerText === 'Login.') {
              e.preventDefault();
        }}
      }>
        { component }
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    modal: state.ui.modal
  };
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
});
export default connect(mapStateToProps,
  mapDispatchToProps)(Modal);
