import React from 'react';
import StoryIndexItem from './story_index_item';

class LikedStories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: this.props.likedStories
    }
  }

  componentDidMount() {
    this.props.fetchLikedStories(this.props.user.id)
  }

  componentWillReceiveProps(nextProps) {
    let stories = nextProps.likedStories;
    if (this.props.likedStories[0] !== stories[0]) {
      this.state = {
        stories
      };
    }
  }

  render () {
    if (this.state.stories.length > 0 && this.state.stories[0] !== undefined) {
      let stories = this.state.stories;
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
      return (
        <div></div>
      )
    }
  }
}

export default LikedStories;
