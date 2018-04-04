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
      <div className='greet-signout'>
        <button className='signout-button' onClick={this.props.logout}>Sign Out</button>
        <p>Welcome {user.username}!</p>
      </div>
    );
  }

  navLinks () {
    return (
      <nav className='login-signup'>
        <button className='login-button' onClick={() => this.props.openModal('login')}>Sign in</button>
        <button className='signup-button' onClick={() => this.props.openModal('signup')}>Get started</button>
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
