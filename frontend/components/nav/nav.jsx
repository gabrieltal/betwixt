import React from 'react';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import { Link } from 'react-router-dom';
import NewStoryContainer from '../story/new_story_container';

class Nav extends React.Component {
  welcomeUser () {
    const user = Object.values(this.props.currentUser)[0];
    return (
      <div className='greet-signout'>
        <Link to={'/'}><button className='signout-button' onClick={this.props.logout}>Sign Out</button></Link>
        <Link to={'/story/new'} className='new-story-button'>New Story</Link>
        <div className="create-text"><div className="arrow-up"></div>Create New Story</div>
        <Link to={`/user/${user.id}`}><img src={user.image_url}/></Link>
      </div>
    );
  }

  navLinks () {
    return (
      <nav className='login-signup'>
        <button className='login-button' onClick={() => this.props.openModal('login')}>Sign in</button>
        <button className='signup-button' onClick={() => this.props.openModal('signup')}>Get started</button>
        <button className='demo-button' onClick={() => (this.props.login({username: "guest", password: "password"}))}>Demo</button>
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
