import React from 'react';
import StoryIndexItem from './story_index_item';
class StoryIndex extends React.Component {
  componentDidMount () {
    this.props.fetchStories();
  }

  render () {
    let stories = this.props.stories;
    stories = Object.keys(stories).map((id) => {
      return <StoryIndexItem key={id} story={stories[id]}/>;
    });
    return (
      <section>
        <ul>
          {stories}
        </ul>
      </section>
    );
  }
}

export default StoryIndex;
