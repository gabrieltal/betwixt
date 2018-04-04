import React from 'react';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInOpen: false,
      signUpOpen: false,
    };
  }

  welcomeUser () {
    const user = Object.values(this.props.currentUser)[0];
    return (
      <div>
        <p>Welcome {user.username}!</p>
        <button onClick={this.props.logout}>Sign Out</button>
      </div>
    );
  }

  navLinks () {
    return (
      <nav className='login-signup'>
        <button onClick={() => this.props.openModal('signup')}>Get started</button>
        <button onClick={() => this.props.openModal('login')}>Sign in</button>
      </nav>
    )
  }

  render () {
    return (
      this.props.currentUser ? this.welcomeUser() : this.navLinks()
    );
  }
}

export default Nav;
