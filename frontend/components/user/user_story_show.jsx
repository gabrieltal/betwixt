import React from 'react';
import StoryIndexItem from '../story/story_index_item';

class UserStoryShow extends React.Component{

  render () {
    if (this.props.authoredStories.length > 0 && this.props.authoredStories[0] !== undefined) {
      let stories = this.props.authoredStories;
      stories = stories.map((story) => (
        <StoryIndexItem key={story.id} story={story} />
      ));
      return (
        <ul className="user-stories">
          {stories}
        </ul>
      );
    } else {
      return ( <div></div>)
    }
  }
}

export default UserStoryShow;
