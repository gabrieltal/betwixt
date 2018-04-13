import React from 'react';
import StoryIndexItem from './story_index_item';
class StoryIndex extends React.Component {
  componentDidMount () {
    this.props.fetchStories();
  }

  render () {
    let stories;
    if (!!this.props.currentUser) {
      stories = this.props.storiesList || this.props.stories;
    } else {
      stories = this.props.stories;
    }
    stories = Object.keys(stories).map((id) => {
      return <StoryIndexItem key={id}
        story={stories[id]}/>;
    });
    return (
      <section>
      <ul className="story-index">
      {stories}
      </ul>
      </section>
    );
  }
}

export default StoryIndex;
