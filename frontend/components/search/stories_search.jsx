import React from 'react';
import StoryIndexItem from '../story/story_index_item';

class StoriesSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.searchParams,
      errors: []
    }
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
        errors: [],
      })
    }
  }

  render () {
    if (Object.keys(this.props.stories).length === 0 || this.state.errors.length === 1) {
      return (
        <h2 id="no-results">
          No results found
        </h2>
      );
    } else {
      let stories = Object.values(this.props.stories).map((story, i) => (
        <StoryIndexItem key={story.id} story={story} feature="" />
      ));

      return (
        <ul className="user-stories">
          {stories}
        </ul>
      )
    }
  }

}

export default StoriesSearch;
