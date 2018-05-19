import React from 'react';
import StoryIndexItem from '../story/story_index_item';
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.searchParams,
      errors: []
    }

    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.searchTaggedStories(this.props.searchParams);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors.length === 1) {
      this.setState({
        errors: nextProps.errors
      })
    }
    if (this.props.searchParams !== nextProps.searchParams) {
      this.props.clearErrors();
      this.props.searchTaggedStories(nextProps.searchParams);
      this.setState({
        errors: []
      })
    }
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  handleSubmit(e) {
    this.props.history.push(`/search/${this.state.search}`)
  }

  render () {
    if (Object.keys(this.props.stories).length === 0 || this.state.errors.length === 1) {
      return (
        <main className="search-container">
          <form onSubmit={this.handleSubmit} className="search-form-container">
            <input type="text" onChange={this.update} placeholder="Search Betwixt" value={this.state.search}/>
          </form>
          <h2 id="no-results">
            No results found
          </h2>
        </main>
      )
    } else {
      let stories = Object.values(this.props.stories).map((story) => {
        return (<li><StoryIndexItem key={story.id}
          story={story}
          feature="" />
        </li>);
      })
      return (
        <main className="search-container">
          <form onSubmit={this.handleSubmit} className="search-form-container">
            <input type="text" onChange={this.update} placeholder="Search Betwixt" value={this.state.search}/>
          </form>
          <ul className="user-stories">
            {stories}
          </ul>
        </main>
      )
    }
  }
}

export default Search;
