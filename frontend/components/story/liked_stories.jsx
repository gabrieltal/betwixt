import React from 'react';
import StoryIndexItem from './story_index_item';

class LikedStories extends React.Component {
  render () {
    if (this.props.likedStories.length > 0 && this.props.likedStories[0] !== undefined) {
      let stories = this.props.likedStories;

      stories = stories.map((story) => {
        if (typeof story !== 'undefined') {
          return <StoryIndexItem key={story.id} story={story}/>
        }
      });

      return (
        <ul className="story-index">
          {stories}
        </ul>
      )
    } else {
      console.log("hi")
      return (
        <div></div>
      )
    }
  }
}

export default LikedStories;
