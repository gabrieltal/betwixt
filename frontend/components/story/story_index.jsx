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
    let featureItems = [];
    let storyItems = [];
    stories.forEach((story, i) => {
      i < 3 ?
        featureItems.push(<StoryIndexItem key={story.id}
        story={story} feature='feature' />) :

        storyItems.push(<StoryIndexItem key={story.id}
          story={story} feature=""/>);
    });
    return (
      <section>
      <ul className="story-index features">
        {featureItems}
      </ul>
      <ul className="story-index">
        {storyItems}
      </ul>
      </section>
    );
  }
}

export default StoryIndex;
