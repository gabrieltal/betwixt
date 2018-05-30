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
    this.displaySearchBar = this.displaySearchBar.bind(this);
    this.removeSearchBar = this.removeSearchBar.bind(this);
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  removeSearchBar(e) {
    let searchBar = document.querySelector(".search-form-container");
    let searchIcon = document.querySelector(".anchor");
    searchIcon.style.left = '90px';
    searchBar.style.visibility = "hidden";
    searchBar.style.opacity = 0;
    this.setState({
      search: ''
    })
  }

  displaySearchBar(e) {
    let searchBar = document.querySelector(".search-form-container");
    let searchIcon = document.querySelector(".anchor");
    searchIcon.style.left = '-25px';
    searchBar.style.visibility = "visible";
    searchBar.style.opacity = 1;
  }

  handleSubmit(e) {
    let search = this.state.search;
    if (this.state.search.trim().length === 0) {
      search = '1984';
    }
    this.props.history.push(`/search/${search}`)
  }

  searchForm() {
    return (
      <aside className="search-family">
        <span className="anchor">
          <span id="search-glass" onClick={this.displaySearchBar} className="fas fa-search"></span>
        </span>
        <form className="search-form-container" onBlur={this.removeSearchBar} onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.update} placeholder="Search Betwixt" value={this.state.search}/>
        </form>
      </aside>
    );
  }

  welcomeUser () {
    const user = Object.values(this.props.currentUser)[0];
    return (
      <div className='greet-signout'>
        {this.searchForm()}
        <Link to={'/'}><button className='signout-button' onClick={this.props.logout}>Sign Out</button></Link>
        <Link to={'/story/new'} className='new-story-button'>New Story</Link>
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
