import React from 'react';
import StoriesSearchContainer from './stories_search_container';
import UsersSearchContainer from './users_search_container';
import debounce from 'lodash/debounce';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchParams,
      selected: 'Stories',
      searchParams: this.props.searchParams,
      inputErrorMessage: ''
    }

    this.selectTab = this.selectTab.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  selectTab(pane) {
    return e => this.setState({
      selected: pane
    })
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  handleSubmit(e) {
    let search = this.state.search;
    if (search.trim().length === 0) {
      this.setState({
        inputErrorMessage: 'Search parameters cannot be blank!',
        search: ''

      })
      return;
    } else {
      this.setState({
        inputErrorMessage: '',
      })
    }

    this.setState({
      searchParams: search
    });


    this.props.history.push(`/search/${this.state.search}`)
  }

  render () {
    let component;
    let storiesClass = 'tab';
    let usersClass = 'tab';
    if (this.state.selected === 'Stories') {
      storiesClass += 'Selected';
      usersClass = 'tab';
      component = <StoriesSearchContainer searchParams={this.state.searchParams}/>
    } else {
      usersClass += 'Selected';
      storiesClass = 'tab';
      component = <UsersSearchContainer searchParams={this.state.searchParams}/>
    }

    return (
      <main className="search-container">
        <form onSubmit={this.handleSubmit} className="search-form-container">
          <input type="text" onChange={this.update}
            placeholder="Search Betwixt" value={this.state.search}
          />
        </form>
        <h3 id="searchParamsError">{this.state.inputErrorMessage}</h3>
        <nav className="tab-header">
          <button className={storiesClass} onClick={this.selectTab("Stories")}>
            Stories
          </button>
          <button className={usersClass} onClick={this.selectTab("Users")}>
            Users
          </button>
        </nav>
        {component}
      </main>
    )
  }

}

export default Search;
