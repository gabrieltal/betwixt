import React from 'react';
import StoryIndexItem from './story_index_item';
class StoryIndex extends React.Component {
  componentDidMount () {
    this.props.fetchStories();
  }

  render () {
    let stories;
    if (!!this.props.currentUser && !!this.props.storiesList.length) {
      stories = this.props.storiesList
    } else {
      stories = Object.values(this.props.stories);
    }
    let storiesItems = stories.map((story) => {
      return <StoryIndexItem key={story.id}
        story={story}/>;
    });
    return (
      <section>
      <ul className="story-index">
      {storiesItems}
      </ul>
      </section>
    );
  }
}

export default StoryIndex;
