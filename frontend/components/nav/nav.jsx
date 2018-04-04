import React from 'react';
import Modal from 'react-modal';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInOpen: false,
      signUpOpen: false
    };
    this.signUpOpenModal = this.signUpOpenModal.bind(this);
    this.signInOpenModal = this.signInOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  welcomeUser () {
    return (
      <div>
        <p>Welcome {this.props.currentUser.username}!</p>
      </div>
    );
  }

  navLinks () {
    return (
      <div>
        <button onClick={this.signUpOpenModal}>Get started</button>
        <button onClick={this.signInOpenModal}>Sign in</button>

        <Modal isOpen={this.state.signUpOpen} onRequestClose={this.closeModal}><SignupFormContainer /></Modal>
        <Modal isOpen={this.state.signInOpen} onRequestClose={this.closeModal}><LoginFormContainer /></Modal>

      </div>
    )
  }

  signUpOpenModal () {
    this.setState({ signUpOpen: true });
  }

  signInOpenModal () {
    this.setState({ signInOpen: true });
  }

  closeModal () {
    this.setState({ modalIsOpen: false,
      signUpOpen: false,
      signInOpen: false,
    });
  }

  render () {
    return (
      this.props.currentUser ? this.welcomeUser() : this.navLinks()
    );
  }
}

export default Nav;
