import React from 'react';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import { Link, withRouter } from 'react-router-dom';
import NewStoryContainer from '../story/new_story_container';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    }
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  handleSubmit(e) {
    this.props.history.push(`/search/${this.state.search}`)
  }

  searchForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.update} placeholder="Search Betwixt" value={this.state.search}/>
      </form>
    );
  }

  welcomeUser () {
    const user = Object.values(this.props.currentUser)[0];
    return (
      <div className='greet-signout'>
        {this.searchForm()}
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
        {this.searchForm()}
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

export default withRouter(Nav);
